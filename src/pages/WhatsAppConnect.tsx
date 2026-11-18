// File: src/pages/WhatsAppConnect.tsx  (fanitt-website)
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, RefreshCw, Send, Unplug } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, ErrorBox, LoginButton, PayButton, WhoAmI } from '@/components/Buy';

/**
 * fanitt.com/connect/whatsapp — connect a WhatsApp Business number to Fanitt
 * with Meta's Embedded Signup, then send a test message, see templates and
 * see replies (they arrive through the webhook).
 *
 * .env: VITE_META_APP_ID, VITE_META_CONFIG_ID (Facebook Login for Business →
 * Configurations → WhatsApp Embedded Signup).
 */

const APP_ID = (import.meta.env.VITE_META_APP_ID as string | undefined) ?? '';
const CONFIG_ID = (import.meta.env.VITE_META_CONFIG_ID as string | undefined) ?? '';
const GRAPH_VERSION = 'v24.0';

type Msg = { direction: 'in' | 'out'; peer: string; kind: string; text: string; status: string; at: string };
type Account = {
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  status: string;
  lastError: string;
  connectedAt: string;
  messages: Msg[];
};
type Template = { name: string; status: string; language: string; category: string };

type FBLoginResponse = { authResponse?: { code?: string } | null; status?: string };
type FBSdk = {
  init: (o: Record<string, unknown>) => void;
  login: (cb: (r: FBLoginResponse) => void, o: Record<string, unknown>) => void;
};
declare global {
  interface Window {
    FB?: FBSdk;
    fbAsyncInit?: () => void;
  }
}

/** Loads Meta's JavaScript SDK once. */
function loadFacebookSdk(): Promise<FBSdk> {
  if (window.FB) return Promise.resolve(window.FB);
  return new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      window.FB!.init({ appId: APP_ID, autoLogAppEvents: true, xfbml: false, version: GRAPH_VERSION });
      resolve(window.FB!);
    };
    if (!document.getElementById('facebook-jssdk')) {
      const s = document.createElement('script');
      s.id = 'facebook-jssdk';
      s.src = 'https://connect.facebook.net/en_US/sdk.js';
      s.async = true;
      s.defer = true;
      s.crossOrigin = 'anonymous';
      s.onerror = () => reject(new Error('Could not load Facebook. Check your internet or ad blocker.'));
      document.body.appendChild(s);
    }
  });
}

const field =
  'w-full rounded-2xl border border-ink/10 bg-white px-5 py-3 text-[16px] text-ink outline-none transition-all placeholder:text-ink-mute/70 focus:border-flame focus:ring-4 focus:ring-flame/10';

const time = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function WhatsAppConnect() {
  usePageTitle('Connect WhatsApp', 'Connect your WhatsApp Business number to Fanitt.');
  const { session } = useAuth();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [to, setTo] = useState('');
  const [text, setText] = useState('');
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [tpl, setTpl] = useState({ name: '', category: 'UTILITY', language: 'en_US', body: '' });

  // Embedded Signup gives the code (FB.login) and the number ids (a window
  // message) separately — whichever comes second finishes the connection.
  const signup = useRef<{ code?: string; wabaId?: string; phoneNumberId?: string; coexistence?: boolean }>({});

  const loadAccount = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const { data } = await api<Account | null>('/whatsapp/connect/me');
      setAccount(data);
    } catch (e) {
      if (!quiet) setError((e as Error).message);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) loadAccount();
    else setLoading(false);
  }, [session, loadAccount]);

  // New replies show up without reloading.
  useEffect(() => {
    if (!account) return;
    const t = window.setInterval(() => loadAccount(true), 8000);
    return () => window.clearInterval(t);
  }, [account, loadAccount]);

  const finishConnect = useCallback(async () => {
    const { code, wabaId, phoneNumberId, coexistence } = signup.current;
    if (!code || !wabaId || !phoneNumberId) return;
    signup.current = {};
    setBusy('connect');
    setError('');
    try {
      const { data } = await api<Account>('/whatsapp/connect', { body: { code, wabaId, phoneNumberId, coexistence: !!coexistence } });
      setAccount(data);
      setNotice('Your WhatsApp Business number is connected.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  }, []);

  // Number ids from the Embedded Signup popup.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      try {
        if (!/(^|\.)facebook\.com$/.test(new URL(event.origin).hostname)) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.type !== 'WA_EMBEDDED_SIGNUP') return;
        if (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA' || data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING') {
          signup.current.wabaId = data.data?.waba_id;
          if (data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING') signup.current.coexistence = true;
          signup.current.phoneNumberId = data.data?.phone_number_id;
          if (!signup.current.phoneNumberId) {
            setError('No phone number was added in the popup. Please connect again and add a number.');
            setBusy('');
            return;
          }
          finishConnect();
        } else if (data.event === 'CANCEL') {
          setBusy('');
          setError(data.data?.current_step ? `Setup was closed at "${data.data.current_step}". Please try again.` : 'Setup was cancelled.');
        } else if (data.event === 'ERROR') {
          setBusy('');
          setError(data.data?.error_message || 'Meta reported an error. Please try again.');
        }
      } catch {
        // not an Embedded Signup message
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [finishConnect]);

  // businessApp: the number already runs on the WhatsApp Business app — keep the
  // app and connect it too (Meta "coexistence"); otherwise a new number.
  const startConnect = async (businessApp = false) => {
    setError('');
    setNotice('');
    if (!APP_ID || !CONFIG_ID) {
      setError('WhatsApp connect is not set up yet (missing Meta App ID / Configuration ID).');
      return;
    }
    setBusy('connect');
    signup.current = { coexistence: businessApp };
    try {
      const FB = await loadFacebookSdk();
      FB.login(
        (response) => {
          const code = response.authResponse?.code;
          if (!code) {
            setBusy('');
            return; // closed without finishing — the window message explains why
          }
          signup.current.code = code;
          finishConnect();
        },
        {
          config_id: CONFIG_ID,
          response_type: 'code',
          override_default_response_type: true,
          extras: { setup: {}, featureType: businessApp ? 'whatsapp_business_app_onboarding' : '', sessionInfoVersion: '3', version: 'v4' },
        },
      );
    } catch (e) {
      setBusy('');
      setError((e as Error).message);
    }
  };

  const sendMessage = async () => {
    setBusy('send');
    setError('');
    setNotice('');
    try {
      const { data } = await api<Account>('/whatsapp/connect/send', { body: { to, text: text.trim() } });
      setAccount(data);
      setText('');
      setNotice('Message sent. Check WhatsApp on that phone.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  };

  const loadTemplates = async () => {
    setBusy('templates');
    setError('');
    try {
      const { data } = await api<Template[]>('/whatsapp/connect/templates');
      setTemplates(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  };

  const createTemplate = async () => {
    setBusy('create');
    setError('');
    setNotice('');
    try {
      const { data } = await api<Template>('/whatsapp/connect/templates', { body: tpl });
      setNotice(`Template "${data.name}" created — status: ${data.status}. Meta reviews it, usually within minutes.`);
      setTpl({ name: '', category: 'UTILITY', language: 'en_US', body: '' });
      const list = await api<Template[]>('/whatsapp/connect/templates');
      setTemplates(list.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  };

  const disconnect = async () => {
    setBusy('disconnect');
    setError('');
    try {
      await api('/whatsapp/connect', { method: 'DELETE' });
      setAccount(null);
      setTemplates(null);
      setNotice('WhatsApp disconnected.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  };

  return (
    <BuyPage wide>
      <Card>
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#128C7E]">
            <MessageCircle size={26} />
          </span>
          <div>
            <h1 className="font-display text-[28px] font-extrabold leading-tight">Connect WhatsApp</h1>
            <p className="mt-1 text-ink-soft">Link your WhatsApp Business number to Fanitt to send updates to your customers and see their replies here.</p>
          </div>
        </div>

        {notice && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-[14px] font-semibold text-emerald-700">
            <CheckCircle2 size={18} /> {notice}
          </div>
        )}
        {error && (
          <div className="mt-5">
            <ErrorBox message={error} />
          </div>
        )}

        {!session ? (
          <div className="mt-6">
            <LoginButton label="Log in to connect WhatsApp" />
          </div>
        ) : loading ? (
          <div className="mt-8 flex justify-center text-ink-mute">
            <Loader2 className="animate-spin" />
          </div>
        ) : !account ? (
          <div className="mt-6 space-y-4">
            <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-ink-soft">
              <li>Click the button and log in with Facebook.</li>
              <li>Choose or create your business and WhatsApp Business account.</li>
              <li>Add your phone number and verify it with the code.</li>
            </ol>
            <PayButton busy={busy === 'connect'} onClick={() => startConnect(true)}>
              {busy === 'connect' ? 'Connecting…' : 'Connect my WhatsApp Business app number'}
            </PayButton>
            <button
              type="button"
              onClick={() => startConnect(false)}
              disabled={busy === 'connect'}
              className="h-12 w-full rounded-2xl border border-ink/10 text-[15px] font-bold text-ink-soft hover:bg-ink/5 disabled:opacity-50"
            >
              Connect a new number (not on WhatsApp)
            </button>
            <WhoAmI />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Connected number */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-emerald-600">
                    <CheckCircle2 size={15} /> Connected
                  </p>
                  <p className="mt-1 font-display text-[22px] font-extrabold">{account.displayPhoneNumber || account.phoneNumberId}</p>
                  {account.verifiedName && <p className="text-[15px] text-ink-soft">{account.verifiedName}</p>}
                </div>
                <button
                  type="button"
                  onClick={disconnect}
                  disabled={busy === 'disconnect'}
                  className="inline-flex items-center gap-2 rounded-xl border border-ink/10 px-4 py-2 text-[14px] font-bold text-ink-soft hover:bg-ink/5 disabled:opacity-50"
                >
                  <Unplug size={16} /> Disconnect
                </button>
              </div>
              <p className="mt-3 text-[13px] text-ink-mute">
                WhatsApp Business Account ID {account.wabaId} · Phone number ID {account.phoneNumberId}
              </p>
              {account.lastError && <p className="mt-2 text-[13px] font-semibold text-amber-700">Note: {account.lastError}</p>}
            </div>

            {/* Send a message */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <h2 className="font-display text-[18px] font-extrabold">Send a message</h2>
              <p className="mt-1 text-[14px] text-ink-soft">
                Leave the message empty to send the approved <b>hello_world</b> template. Plain text reaches only people who messaged this number in the last 24 hours.
              </p>
              <div className="mt-4 space-y-3">
                <input value={to} onChange={(e) => setTo(e.target.value)} inputMode="tel" placeholder="Phone with country code, e.g. 919876543210" className={field} />
                <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 1000))} rows={2} placeholder="Message (optional)" className={field} />
                <PayButton busy={busy === 'send'} disabled={to.replace(/\D/g, '').length < 10} onClick={sendMessage}>
                  <Send size={18} /> {text.trim() ? 'Send message' : 'Send hello_world template'}
                </PayButton>
              </div>
            </div>

            {/* Create a template */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <h2 className="font-display text-[18px] font-extrabold">Create a message template</h2>
              <p className="mt-1 text-[14px] text-ink-soft">Templates are needed to message people who haven’t written to you in the last 24 hours. Meta reviews each new template.</p>
              <div className="mt-4 space-y-3">
                <input
                  value={tpl.name}
                  onChange={(e) => setTpl({ ...tpl, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                  placeholder="Template name, e.g. booking_confirmation"
                  className={field}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select value={tpl.category} onChange={(e) => setTpl({ ...tpl, category: e.target.value })} className={field}>
                    <option value="UTILITY">Utility (updates, confirmations)</option>
                    <option value="MARKETING">Marketing (offers, promotions)</option>
                  </select>
                  <select value={tpl.language} onChange={(e) => setTpl({ ...tpl, language: e.target.value })} className={field}>
                    <option value="en_US">English (US)</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
                <textarea
                  value={tpl.body}
                  onChange={(e) => setTpl({ ...tpl, body: e.target.value.slice(0, 1024) })}
                  rows={3}
                  placeholder="Message text, e.g. Your Fanitt booking is confirmed. See you at the session!"
                  className={field}
                />
                <PayButton busy={busy === 'create'} disabled={!tpl.name.trim() || !tpl.body.trim()} onClick={createTemplate}>
                  Create template
                </PayButton>
              </div>
            </div>

            {/* Templates */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-[18px] font-extrabold">Message templates</h2>
                <button type="button" onClick={loadTemplates} disabled={busy === 'templates'} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-flame disabled:opacity-50">
                  <RefreshCw size={15} className={busy === 'templates' ? 'animate-spin' : ''} /> {templates ? 'Refresh' : 'Load templates'}
                </button>
              </div>
              {templates && (
                <ul className="mt-3 divide-y divide-ink/5">
                  {templates.length === 0 && <li className="py-2 text-[14px] text-ink-mute">No templates yet.</li>}
                  {templates.map((t) => (
                    <li key={`${t.name}-${t.language}`} className="flex items-center justify-between gap-3 py-2 text-[14px]">
                      <span className="font-semibold text-ink">
                        {t.name} <span className="font-normal text-ink-mute">· {t.language} · {t.category}</span>
                      </span>
                      <span className={t.status === 'APPROVED' ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'}>{t.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Messages */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-[18px] font-extrabold">Messages</h2>
                <button type="button" onClick={() => loadAccount(true)} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-flame">
                  <RefreshCw size={15} /> Refresh
                </button>
              </div>
              {account.messages.length === 0 ? (
                <p className="mt-3 text-[14px] text-ink-mute">No messages yet. Send one above, then reply from WhatsApp — replies appear here.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {account.messages.map((m, i) => (
                    <li key={i} className={m.direction === 'out' ? 'flex justify-end' : 'flex justify-start'}>
                      <div className={m.direction === 'out' ? 'max-w-[85%] rounded-2xl bg-[#DCF8C6] px-4 py-2' : 'max-w-[85%] rounded-2xl bg-ink/5 px-4 py-2'}>
                        <p className="text-[15px] text-ink">{m.text || `[${m.kind}]`}</p>
                        <p className="mt-0.5 text-[12px] text-ink-mute">
                          {m.direction === 'out' ? `To +${m.peer}` : `From +${m.peer}`} · {time(m.at)} · {m.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <WhoAmI />
          </div>
        )}
      </Card>
    </BuyPage>
  );
}