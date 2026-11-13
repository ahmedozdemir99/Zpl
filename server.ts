import express, { type Request as ExpressRequest, type Response as ExpressResponse } from 'express';
import { handleCoach } from './server/coach.mjs';
import { handleDuel } from './server/duel.mjs';
import { handleStudent } from './server/student.mjs';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';

dotenv.config();

// In-memory mock for Cloudflare D1 database tables (student_profiles, student_results, duel_rooms)
function createMockD1() {
  const profiles = new Map<string, string>();
  const results = new Map<string, Array<{ id: string; date: string; result: string }>>();
  const duelRooms = new Map<string, { id: string; code: string; state: string; version: number; expires_at: number }>();

  return {
    prepare(sql: string) {
      const normalized = sql.replace(/\s+/g, ' ').trim();
      return {
        bind(...args: any[]) {
          return {
            async first() {
              if (normalized.startsWith('SELECT profile FROM student_profiles')) {
                const profile = profiles.get(String(args[0]));
                return profile !== undefined ? { profile } : null;
              }
              if (normalized.startsWith('SELECT 1 FROM student_profiles')) {
                return profiles.has(String(args[0])) ? { 1: 1 } : null;
              }
              if (normalized.startsWith('SELECT id, code, state, version FROM duel_rooms WHERE id = ?')) {
                const [id, now] = args;
                const row = duelRooms.get(String(id));
                return row && row.expires_at > Number(now) ? { ...row } : null;
              }
              if (normalized.startsWith('SELECT id, code, state, version FROM duel_rooms WHERE code = ?')) {
                const [code, now] = args;
                for (const row of duelRooms.values()) {
                  if (row.code === String(code) && row.expires_at > Number(now)) {
                    return { ...row };
                  }
                }
                return null;
              }
              return null;
            },
            async all() {
              if (normalized.startsWith('SELECT result FROM student_results')) {
                const list = results.get(String(args[0])) ?? [];
                const sorted = [...list].sort((a, b) => b.date.localeCompare(a.date));
                return { results: sorted.map(item => ({ result: item.result })) };
              }
              return { results: [] };
            },
            async run() {
              if (normalized.startsWith('INSERT INTO student_profiles')) {
                const [userId, profile] = args;
                profiles.set(String(userId), String(profile));
                return { meta: { changes: 1 } };
              }
              if (normalized.startsWith('INSERT OR IGNORE INTO student_results')) {
                const [userId, id, date, result] = args;
                const key = String(userId);
                const list = results.get(key) ?? [];
                if (list.some(item => item.id === String(id))) {
                  return { meta: { changes: 0 } };
                }
                list.push({ id: String(id), date: String(date), result: String(result) });
                results.set(key, list);
                return { meta: { changes: 1 } };
              }
              if (normalized.startsWith('DELETE FROM duel_rooms WHERE expires_at <=')) {
                const now = Number(args[0]);
                let changes = 0;
                for (const [id, row] of duelRooms.entries()) {
                  if (row.expires_at <= now) {
                    duelRooms.delete(id);
                    changes++;
                  }
                }
                return { meta: { changes } };
              }
              if (normalized.startsWith('INSERT OR IGNORE INTO duel_rooms')) {
                const [id, code, state, expiresAt] = args;
                const key = String(id);
                if (duelRooms.has(key)) return { meta: { changes: 0 } };
                for (const row of duelRooms.values()) {
                  if (row.code === String(code)) return { meta: { changes: 0 } };
                }
                duelRooms.set(key, {
                  id: key,
                  code: String(code),
                  state: String(state),
                  version: 0,
                  expires_at: Number(expiresAt),
                });
                return { meta: { changes: 1 } };
              }
              if (normalized.startsWith('UPDATE duel_rooms SET state = ?')) {
                const [state, expiresAt, id, version] = args;
                const row = duelRooms.get(String(id));
                if (!row || row.version !== Number(version)) {
                  return { meta: { changes: 0 } };
                }
                duelRooms.set(String(id), {
                  ...row,
                  state: String(state),
                  version: row.version + 1,
                  expires_at: Number(expiresAt),
                });
                return { meta: { changes: 1 } };
              }
              return { meta: { changes: 0 } };
            },
          };
        },
      };
    },
  };
}

const mockDb = createMockD1();

function toWebRequest(req: ExpressRequest): Request {
  const origin = req.get('origin');
  const originUrl = origin && URL.canParse(origin) ? new URL(origin) : undefined;
  const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';
  const sameOriginFetch = req.get('sec-fetch-site') === 'same-origin';
  const baseOrigin = originUrl && (originUrl.host === host || sameOriginFetch)
    ? originUrl.origin
    : `${req.protocol}://${host}`;
  const url = new URL(req.originalUrl, baseOrigin);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(', '));
  }
  const body = req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body ?? {}) : undefined;
  return new Request(url, { method: req.method, headers, body });
}

async function sendWebResponse(res: ExpressResponse, response: Response) {
  res.status(response.status).set(Object.fromEntries(response.headers)).send(await response.text());
}

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '10mb' }));

app.get('/healthz', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.send('Zekâ Pro Ligim');
});

app.all('/api/ai/:operation', async (req, res) => {
  const response = await handleCoach(toWebRequest(req), process.env);
  await sendWebResponse(res, response);
});

app.all(['/api/student', '/api/student/*'], async (req, res) => {
  const user = req.get('oai-authenticated-user-id') || 'local-student';
  const response = await handleStudent(toWebRequest(req), mockDb, user);
  await sendWebResponse(res, response);
});

app.all('/duel/*', async (req, res) => {
  const response = await handleDuel(toWebRequest(req), mockDb);
  await sendWebResponse(res, response);
});

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const html = await fs.readFile(path.join(import.meta.dirname, 'index.html'), 'utf-8');
        const template = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distDir = path.join(import.meta.dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Zekâ Akademisi sunucusu http://0.0.0.0:${PORT} üzerinde çalışıyor.`);
  });
}

startServer();
