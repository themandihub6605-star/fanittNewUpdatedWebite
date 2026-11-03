// File: src/lib/api.ts  (fanitt-website)
import { SITE } from '@/config/site';

// Small fetch wrapper for the Fanitt API: adds the login token, refreshes it
// once when it expires and turns errors into a readable message.

export class ApiError extends Error {
  status: number;
  code: string | null;
  constructor(message: string, status = 0, code: string | null = null) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const KEY = 'fanitt_web_session';

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: { _id: string; name: string; email: string; phone?: string; avatarUrl?: string; role: string };
};

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    // private mode — the session just won't be remembered
  }
  window.dispatchEvent(new Event('fanitt:session'));
}

async function refreshTokens(): Promise<boolean> {
  const s = readSession();
  if (!s?.refreshToken) return false;
  try {
    const res = await fetch(`${SITE.apiBase}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: s.refreshToken }),
    });
    if (!res.ok) return false;
    const body = await res.json();
    const d = body?.data;
    if (!d?.accessToken) return false;
    writeSession({ ...s, accessToken: d.accessToken, refreshToken: d.refreshToken || s.refreshToken });
    return true;
  } catch {
    return false;
  }
}

export async function api<T = unknown>(path: string, opts: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<{ data: T; message: string }> {
  const send = () => {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    const s = readSession();
    if (opts.auth !== false && s?.accessToken) headers.Authorization = `Bearer ${s.accessToken}`;
    return fetch(`${SITE.apiBase}${path}`, {
      method: opts.method || (opts.body !== undefined ? 'POST' : 'GET'),
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  };

  let res: Response;
  try {
    res = await send();
    if (res.status === 401 && readSession() && (await refreshTokens())) res = await send();
  } catch {
    throw new ApiError('Can’t reach Fanitt right now. Check your internet and try again.');
  }

  const body = await res.json().catch(() => ({}));
  if (res.status === 401 && readSession()) writeSession(null); // logged out
  if (!res.ok || body?.success === false) {
    throw new ApiError(body?.message || 'Something went wrong. Please try again.', res.status, body?.errorCode || null);
  }
  return { data: body?.data as T, message: body?.message || '' };
}