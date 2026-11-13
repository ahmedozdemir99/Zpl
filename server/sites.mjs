import { handleDuel } from './duel.mjs';
import { handleStudent } from './student.mjs';
import { handleCoach } from './coach.mjs';
import { assets } from './sites-assets.mjs';

const SCHEMA_STATEMENTS = [
  'CREATE TABLE IF NOT EXISTS duel_rooms (id TEXT PRIMARY KEY NOT NULL, code TEXT NOT NULL UNIQUE, state TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL)',
  'CREATE INDEX IF NOT EXISTS duel_rooms_expiry ON duel_rooms (expires_at)',
  'CREATE TABLE IF NOT EXISTS student_profiles (user_id TEXT PRIMARY KEY NOT NULL, profile TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS student_results (user_id TEXT NOT NULL, id TEXT NOT NULL, date TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY (user_id, id))',
  'CREATE INDEX IF NOT EXISTS student_results_date ON student_results (user_id, date DESC)',
];

const schemaReady = new WeakMap();

async function ensureSchema(db) {
  if (!db) return false;
  let pending = schemaReady.get(db);
  if (!pending) {
    pending = (async () => {
      for (const sql of SCHEMA_STATEMENTS) {
        await db.prepare(sql).run();
      }
      return true;
    })().catch(error => {
      schemaReady.delete(db);
      throw error;
    });
    schemaReady.set(db, pending);
  }
  return pending;
}

export function createWorker(getUser, requireLogin = false) {
  return { async fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    if (pathname === '/healthz' && request.method === 'GET') {
      return new Response('Zekâ Pro Ligim', { headers: { 'Cache-Control': 'no-store' } });
    }
    if (pathname === '/favicon.ico' && !assets['/favicon.ico']) {
      return new Response(null, { status: 204 });
    }
    const mustLogin = requireLogin || env?.REQUIRE_ACCESS === 'true';
    const needsUser = mustLogin || pathname === '/api/student' || pathname.startsWith('/api/student/');
    const resolved = needsUser ? await getUser(request, env, context) : undefined;
    const user = typeof resolved === 'string' ? resolved : resolved?.user;
    const setCookie = typeof resolved === 'object' ? resolved?.setCookie : undefined;

    if (mustLogin && !user) {
      return new Response('Bu uygulama için Cloudflare Access ile giriş gerekir.', {
        status: 401, headers: { 'Cache-Control': 'private, no-store' },
      });
    }
    if (pathname.startsWith('/duel/')) {
      if (!env?.DB) return Response.json({ error: 'D1 veritabanı (DB) bağlı değil.' }, { status: 503 });
      await ensureSchema(env.DB);
      return handleDuel(request, env.DB);
    }
    if (pathname === '/api/student' || pathname.startsWith('/api/student/')) {
      if (!env?.DB) return Response.json({ error: 'D1 veritabanı (DB) bağlı değil.' }, { status: 503 });
      await ensureSchema(env.DB);
      const response = await handleStudent(request, env.DB, user);
      if (!setCookie) return response;
      const headers = new Headers(response.headers);
      headers.append('Set-Cookie', setCookie);
      return new Response(response.body, { status: response.status, headers });
    }
    if (pathname.startsWith('/api/ai/')) return handleCoach(request, env);
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405 });
    const asset = assets[pathname === '/' ? '/index.html' : pathname];
    if (!asset) return new Response('Sayfa bulunamadı.', { status: 404 });
    const content = /^(image\/(?!svg\+xml)|font\/)/.test(asset.mime)
      ? Uint8Array.from(atob(asset.content), char => char.charCodeAt(0))
      : asset.content;
    return new Response(request.method === 'HEAD' ? null : content, {
      headers: {
        'Content-Type': asset.mime,
        'Cache-Control': /^\/assets\/[^/]+-[\w-]+\.(js|css)$/.test(pathname) ? 'public, max-age=31536000, immutable' : 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } };
}

export default createWorker(request => request.headers.get('oai-authenticated-user-id'));
