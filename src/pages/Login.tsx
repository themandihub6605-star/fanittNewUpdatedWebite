// File: src/pages/Login.tsx  (fanitt-website)
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { api, ApiError, writeSession, type Session } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { BuyPage, Card, ErrorBox } from '@/components/Buy';
import { usePageTitle } from '@/components/usePageTitle';
import { SITE } from '@/config/site';

const field =
  'h-14 w-full rounded-2xl border border-ink/10 bg-white px-5 text-[16px] text-ink outline-none transition-all placeholder:text-ink-mute/70 focus:border-flame focus:ring-4 focus:ring-flame/10';

/** Only paths on this site (no open redirects). */
function safeNext(raw: string | null) {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/account';
}

export default function Login() {
  usePageTitle('Log in', 'Log in to Fanitt with a code sent to your email.');
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const navigate = useNavigate();
  const { session } = useAuth();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session) navigate(next, { replace: true });
  }, [session, next, navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter the email you use on Fanitt.');
      return;
    }
    setBusy(true);
    try {
      const { data } = await api<{ challenge: string; resendInSeconds: number }>('/auth/web/send-code', { body: { email: email.trim() }, auth: false });
      setChallenge(data.challenge);
      setCode('');
      setResendIn(data.resendInSeconds || 45);
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setBusy(true);
    try {
      const { data } = await api<Session>('/auth/web/verify', { body: { challenge, code: code.trim() }, auth: false });
      writeSession(data);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <BuyPage>
      <Card>
        <span className="flame-bg flex h-14 w-14 items-center justify-center rounded-2xl text-white">
          <Mail size={24} />
        </span>
        {!challenge ? (
          <form onSubmit={sendCode} className="mt-5">
            <h1 className="font-display text-[30px] font-extrabold leading-tight">Log in to Fanitt</h1>
            <p className="mt-2 text-ink-soft">Enter the email of your Fanitt account. We’ll send you a 6-digit code — no password needed.</p>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${field} mt-6`}
              autoFocus
            />
            {error && <div className="mt-4"><ErrorBox message={error} /></div>}
            <button type="submit" disabled={busy} className="flame-bg mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-extrabold text-white disabled:opacity-60">
              {busy && <Loader2 size={18} className="animate-spin" />} Send code
            </button>
            <p className="mt-5 text-center text-[13px] text-ink-mute">
              New to Fanitt?{' '}
              <a href={SITE.playStore} target="_blank" rel="noreferrer" className="font-bold text-flame">
                Get the app
              </a>{' '}
              and sign up there first.
            </p>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-5">
            <button type="button" onClick={() => setChallenge('')} className="mb-3 flex items-center gap-1 text-[13px] font-bold text-ink-mute hover:text-ink">
              <ArrowLeft size={14} /> Change email
            </button>
            <h1 className="font-display text-[30px] font-extrabold leading-tight">Check your email</h1>
            <p className="mt-2 text-ink-soft">
              We sent a 6-digit code to <b className="text-ink">{email.trim().toLowerCase()}</b>. Check spam too.
            </p>
            <input
              ref={codeRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`${field} mt-6 text-center font-display text-[26px] font-extrabold tracking-[0.5em]`}
            />
            {error && <div className="mt-4"><ErrorBox message={error} /></div>}
            <button type="submit" disabled={busy || code.length !== 6} className="flame-bg mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-extrabold text-white disabled:opacity-60">
              {busy && <Loader2 size={18} className="animate-spin" />} Log in
            </button>
            <p className="mt-5 text-center text-[13px] text-ink-mute">
              Didn’t get it?{' '}
              {resendIn > 0 ? (
                <span>Send again in {resendIn}s</span>
              ) : (
                <button type="button" onClick={() => sendCode()} className="font-bold text-flame">
                  Send again
                </button>
              )}
            </p>
          </form>
        )}
      </Card>
    </BuyPage>
  );
}