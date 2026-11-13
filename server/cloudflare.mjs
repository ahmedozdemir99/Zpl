import { createWorker } from './sites.mjs';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readCookie(header, name) {
  if (!header) return '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=').trim();
  }
  return '';
}

export default createWorker(async (request, env, context) => {
  const accessEmail = request.headers.get('cf-access-authenticated-user-email');
  if (typeof accessEmail === 'string' && accessEmail.trim()) {
    return 'cf-access:' + accessEmail.trim().toLowerCase();
  }
  const identity = await context?.access?.getIdentity().catch(() => undefined);
  if (typeof identity?.email === 'string' && identity.email.trim()) {
    return 'cf-access:' + identity.email.trim().toLowerCase();
  }
  if (env?.REQUIRE_ACCESS === 'true') return undefined;

  const existing = readCookie(request.headers.get('cookie'), 'zeka_uid');
  if (uuidPattern.test(existing)) return 'browser:' + existing;

  const created = crypto.randomUUID();
  const isHttps = new URL(request.url).protocol === 'https:';
  const setCookie = `zeka_uid=${created}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${isHttps ? '; Secure' : ''}`;
  return { user: 'browser:' + created, setCookie };
}, false);
