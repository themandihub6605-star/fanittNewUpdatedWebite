// File: src/pages/InstagramConnect.tsx  (fanitt-website)
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Instagram, Loader2, MessageCircleReply, RefreshCw, Trash2, Unplug } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, ErrorBox, LoginButton, PayButton, WhoAmI } from '@/components/Buy';

/**
 * fanitt.com/connect/instagram — connect an Instagram professional account
 * (Instagram Login), see followers and posts/reels, and set Auto DM rules:
 * when someone comments a keyword, Fanitt sends them a DM automatically.
 * Instagram sends the user back here with ?code=…&state=….
 */

type Rule = {
  id: string;
  mediaId: string;
  mediaCaption: string;
  mediaThumb: string;
  mediaPermalink: string;
  keyword: string;
  dmText: string;
  replyText: string;
  active: boolean;
  sentCount: number;
};
type LogLine = {
  commentId: string;
  fromUsername: string;
  commentText: string;
  keyword: string;
  dmStatus: string;
  replyStatus: string;
  error: string;
  at: string;
};
type Account = {
  igUserId: string;
  username: string;
  name: string;
  profilePictureUrl: string;
  followersCount: number;
  followsCount: number;
  mediaCount: number;
  lastError: string;
  rules: Rule[];
  log: LogLine[];
};
type Media = { id: string; caption: string; type: string; thumb: string; permalink: string; timestamp: string; likes: number; comments: number };

const field =
  'w-full rounded-2xl border border-ink/10 bg-white px-5 py-3 text-[16px] text-ink outline-none transition-all placeholder:text-ink-mute/70 focus:border-flame focus:ring-4 focus:ring-flame/10';

const num = (n: number) => new Intl.NumberFormat('en-IN', { notation: n >= 10000 ? 'compact' : 'standard' }).format(n || 0);
const time = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function InstagramConnect() {
  usePageTitle('Connect Instagram', 'Connect your Instagram account to Fanitt and set up Auto DM.');
  const { session } = useAuth();

  const [account, setAccount] = useState<Account | null>(null);
  const [media, setMedia] = useState<Media[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [rule, setRule] = useState({ mediaId: 'any', keyword: '', dmText: '', replyText: '' });
  const finishing = useRef(false);

  const loadAccount = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const { data } = await api<Account | null>('/instagram/me');
      setAccount(data);
    } catch (e) {
      if (!quiet) setError((e as Error).message);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  const loadMedia = useCallback(async () => {
    try {
      const { data } = await api<Media[]>('/instagram/media');
      setMedia(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  // First load — or finish the login when Instagram sent us back with a code.
  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const igError = params.get('error_description') || params.get('error');
    if (igError) {
      setError(igError.replace(/\+/g, ' '));
      window.history.replaceState(null, '', window.location.pathname);
    }
    if (code && !finishing.current) {
      finishing.current = true;
      window.history.replaceState(null, '', window.location.pathname);
      setLoading(true);
      api<Account>('/instagram/connect', { body: { code, state } })
        .then(({ data }) => {
          setAccount(data);
          setNotice(`@${data.username} is connected.`);
        })
        .catch((e) => setError((e as Error).message))
        .finally(() => setLoading(false));
      return;
    }
    if (!code) loadAccount();
  }, [session, loadAccount]);

  useEffect(() => {
    if (account && media === null) loadMedia();
  }, [account, media, loadMedia]);

  // New Auto DM activity shows up without reloading.
  useEffect(() => {
    if (!account) return;
    const t = window.setInterval(() => loadAccount(true), 10000);
    return () => window.clearInterval(t);
  }, [account, loadAccount]);

  const run = async (name: string, fn: () => Promise<void>) => {
    setBusy(name);
    setError('');
    setNotice('');
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  };

  const connect = () =>
    run('connect', async () => {
      const { data } = await api<{ url: string }>('/instagram/auth-url');
      window.location.href = data.url;
    });

  const refresh = () =>
    run('refresh', async () => {
      const { data } = await api<Account>('/instagram/refresh', { method: 'POST' });
      setAccount(data);
      setMedia(null);
    });

  const disconnect = () =>
    run('disconnect', async () => {
      await api('/instagram/connect', { method: 'DELETE' });
      setAccount(null);
      setMedia(null);
      setNotice('Instagram disconnected.');
    });

  const selected = media?.find((m) => m.id === rule.mediaId);

  const saveRule = () =>
    run('rule', async () => {
      const { data } = await api<Account>('/instagram/rules', {
        body: {
          ...rule,
          mediaCaption: selected?.caption || '',
          mediaThumb: selected?.thumb || '',
          mediaPermalink: selected?.permalink || '',
        },
      });
      setAccount(data);
      setRule({ mediaId: 'any', keyword: '', dmText: '', replyText: '' });
      setNotice('Auto DM rule saved. Comment the keyword on the post to test it.');
    });

  const toggleRule = (r: Rule) =>
    run(`toggle-${r.id}`, async () => {
      const { data } = await api<Account>(`/instagram/rules/${r.id}`, { method: 'PATCH', body: { active: !r.active } });
      setAccount(data);
    });

  const deleteRule = (r: Rule) =>
    run(`delete-${r.id}`, async () => {
      const { data } = await api<Account>(`/instagram/rules/${r.id}`, { method: 'DELETE' });
      setAccount(data);
    });

  return (
    <BuyPage wide>
      <Card>
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-flame/10 text-flame">
            <Instagram size={26} />
          </span>
          <div>
            <h1 className="font-display text-[28px] font-extrabold leading-tight">Connect Instagram</h1>
            <p className="mt-1 text-ink-soft">Show your Instagram on Fanitt and send an automatic DM when someone comments a keyword on your post or reel.</p>
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
            <LoginButton label="Log in to connect Instagram" />
          </div>
        ) : loading ? (
          <div className="mt-8 flex justify-center text-ink-mute">
            <Loader2 className="animate-spin" />
          </div>
        ) : !account ? (
          <div className="mt-6 space-y-4">
            <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-ink-soft">
              <li>Your Instagram must be a Professional account (Creator or Business).</li>
              <li>Click the button and log in to Instagram.</li>
              <li>Allow Fanitt to read your profile and posts, and to reply to comments and messages.</li>
            </ol>
            <PayButton busy={busy === 'connect'} onClick={connect}>
              <Instagram size={18} /> Connect Instagram
            </PayButton>
            <WhoAmI />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Profile */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {account.profilePictureUrl ? (
                    <img src={account.profilePictureUrl} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-ink/10" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 text-ink-mute">
                      <Instagram size={24} />
                    </div>
                  )}
                  <div>
                    <p className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-emerald-600">
                      <CheckCircle2 size={15} /> Connected
                    </p>
                    <p className="font-display text-[20px] font-extrabold">@{account.username}</p>
                    {account.name && <p className="text-[14px] text-ink-soft">{account.name}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={refresh}
                    disabled={busy === 'refresh'}
                    className="inline-flex items-center gap-2 rounded-xl border border-ink/10 px-4 py-2 text-[14px] font-bold text-ink-soft hover:bg-ink/5 disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={busy === 'refresh' ? 'animate-spin' : ''} /> Refresh
                  </button>
                  <button
                    type="button"
                    onClick={disconnect}
                    disabled={busy === 'disconnect'}
                    className="inline-flex items-center gap-2 rounded-xl border border-ink/10 px-4 py-2 text-[14px] font-bold text-ink-soft hover:bg-ink/5 disabled:opacity-50"
                  >
                    <Unplug size={16} /> Disconnect
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  ['Followers', account.followersCount],
                  ['Following', account.followsCount],
                  ['Posts', account.mediaCount],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-xl bg-ink/[0.03] py-3">
                    <p className="font-display text-[20px] font-extrabold">{num(value as number)}</p>
                    <p className="text-[13px] text-ink-mute">{label}</p>
                  </div>
                ))}
              </div>
              {account.lastError && <p className="mt-3 text-[13px] font-semibold text-amber-700">Note: {account.lastError}</p>}
            </div>

            {/* Posts & reels */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <h2 className="font-display text-[18px] font-extrabold">Posts & reels</h2>
              {media === null ? (
                <div className="mt-4 flex justify-center text-ink-mute">
                  <Loader2 className="animate-spin" />
                </div>
              ) : media.length === 0 ? (
                <p className="mt-3 text-[14px] text-ink-mute">No posts yet.</p>
              ) : (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {media.map((m) => (
                    <a key={m.id} href={m.permalink} target="_blank" rel="noreferrer" className="group relative block aspect-square overflow-hidden rounded-xl bg-ink/5">
                      {m.thumb ? (
                        <img src={m.thumb} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[12px] text-ink-mute">{m.type}</div>
                      )}
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-ink">{m.type === 'REEL' ? 'Reel' : m.type === 'CAROUSEL_ALBUM' ? 'Album' : 'Post'}</span>
                      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] text-ink">
                        ♥ {num(m.likes)} · 💬 {num(m.comments)}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* New Auto DM rule */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <h2 className="flex items-center gap-2 font-display text-[18px] font-extrabold">
                <MessageCircleReply size={20} /> Auto DM
              </h2>
              <p className="mt-1 text-[14px] text-ink-soft">When someone comments the keyword, they get your message in their Instagram DMs. One DM per comment.</p>
              <div className="mt-4 space-y-3">
                <select value={rule.mediaId} onChange={(e) => setRule({ ...rule, mediaId: e.target.value })} className={field}>
                  <option value="any">Any post or reel</option>
                  {(media || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {(m.type === 'REEL' ? 'Reel' : 'Post') + ' · ' + (m.caption ? m.caption.slice(0, 60) : time(m.timestamp))}
                    </option>
                  ))}
                </select>
                <input value={rule.keyword} onChange={(e) => setRule({ ...rule, keyword: e.target.value.slice(0, 50) })} placeholder="Keyword, e.g. LINK" className={field} />
                <textarea
                  value={rule.dmText}
                  onChange={(e) => setRule({ ...rule, dmText: e.target.value.slice(0, 1000) })}
                  rows={3}
                  placeholder="DM message, e.g. Hey! Here is the link you asked for: https://…"
                  className={field}
                />
                <input
                  value={rule.replyText}
                  onChange={(e) => setRule({ ...rule, replyText: e.target.value.slice(0, 300) })}
                  placeholder="Public reply under the comment (optional), e.g. Sent you a DM ✅"
                  className={field}
                />
                <PayButton busy={busy === 'rule'} disabled={!rule.keyword.trim() || !rule.dmText.trim()} onClick={saveRule}>
                  Save Auto DM rule
                </PayButton>
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <h2 className="font-display text-[18px] font-extrabold">Your rules</h2>
              {account.rules.length === 0 ? (
                <p className="mt-3 text-[14px] text-ink-mute">No rules yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-ink/5">
                  {account.rules.map((r) => (
                    <li key={r.id} className="flex items-start gap-3 py-3">
                      {r.mediaThumb ? (
                        <img src={r.mediaThumb} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-[11px] font-bold text-ink-mute">{r.mediaId === 'any' ? 'All' : 'Post'}</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-ink">
                          “{r.keyword}” <span className="font-normal text-ink-mute">· {r.mediaId === 'any' ? 'any post' : r.mediaCaption || 'one post'} · {r.sentCount} sent</span>
                        </p>
                        <p className="truncate text-[14px] text-ink-soft">DM: {r.dmText}</p>
                        {r.replyText && <p className="truncate text-[13px] text-ink-mute">Reply: {r.replyText}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleRule(r)}
                        disabled={busy === `toggle-${r.id}`}
                        className={r.active ? 'rounded-lg bg-emerald-50 px-3 py-1.5 text-[13px] font-bold text-emerald-700' : 'rounded-lg bg-ink/5 px-3 py-1.5 text-[13px] font-bold text-ink-mute'}
                      >
                        {r.active ? 'On' : 'Off'}
                      </button>
                      <button type="button" onClick={() => deleteRule(r)} disabled={busy === `delete-${r.id}`} className="rounded-lg p-1.5 text-ink-mute hover:bg-ink/5" aria-label="Delete rule">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Activity */}
            <div className="rounded-2xl border border-ink/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-[18px] font-extrabold">Auto DM activity</h2>
                <button type="button" onClick={() => loadAccount(true)} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-flame">
                  <RefreshCw size={15} /> Refresh
                </button>
              </div>
              {account.log.length === 0 ? (
                <p className="mt-3 text-[14px] text-ink-mute">Nothing yet. Comment your keyword on a post from another account to test.</p>
              ) : (
                <ul className="mt-3 divide-y divide-ink/5">
                  {account.log.map((l, i) => (
                    <li key={`${l.commentId}-${i}`} className="py-2.5 text-[14px]">
                      <p className="text-ink">
                        <b>@{l.fromUsername || 'someone'}</b> commented “{l.commentText}”
                      </p>
                      <p className="text-[13px] text-ink-mute">
                        {time(l.at)} · keyword “{l.keyword}” · DM{' '}
                        <span className={l.dmStatus === 'sent' ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>{l.dmStatus}</span>
                        {l.replyStatus && (
                          <>
                            {' '}· reply <span className={l.replyStatus === 'sent' ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>{l.replyStatus}</span>
                          </>
                        )}
                        {l.error && <> · {l.error}</>}
                      </p>
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