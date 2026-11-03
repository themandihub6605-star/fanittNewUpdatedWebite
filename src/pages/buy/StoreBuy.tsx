// File: src/pages/buy/StoreBuy.tsx  (fanitt-website)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Gift, Package, Radio, UserRound } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { payStoreOrder } from '@/lib/checkout';
import { rupees, when } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, Done, ErrorBox, ItemHeader, Loading, LoginButton, NotAvailable, PayButton, WhoAmI } from '@/components/Buy';
import { cn } from '@/components/cn';
import { CommunityList, type PublicCommunity } from '@/components/CommunityList';

export type StoreData = {
  store: { _id: string; slug: string; name: string; tagline?: string; about?: string; logoUrl?: string; bannerUrl?: string; isOpen?: boolean };
  isOwner: boolean;
  products: Array<{ _id: string; title: string; coverUrl?: string; price: number; owned?: boolean }>;
  lives: Array<{ _id: string; title: string; coverUrl?: string; price?: number; status: string; scheduledAt?: string }>;
  meets: Array<{ _id: string; title: string; coverImageUrl?: string; price?: number; scheduledAt?: string }>;
  fanbox: { presets: number[]; minAmount: number; maxAmount: number };
  communities?: PublicCommunity[];
  creatorSlug?: string;
};

/** A creator's Fanitt Store on the web: products, lives, sessions and FanBox. */
export default function StoreBuy({ slug, focusFanbox = false }: { slug: string; focusFanbox?: boolean }) {
  const { session } = useAuth();
  const { data, loading, error, notFound, reload } = useLoad(() => api<StoreData>(`/store/stores/${encodeURIComponent(slug)}`).then((r) => r.data), [slug, session?.user._id]);
  usePageTitle(data?.store.name || 'Store', data?.store.tagline);

  if (loading && !data) return <BuyPage><Loading /></BuyPage>;
  if (notFound || (!data && error)) return <BuyPage>{notFound ? <NotAvailable what="store" /> : <ErrorBox message={error!.message} onRetry={reload} />}</BuyPage>;
  if (!data) return null;
  const { store } = data;

  return (
    <BuyPage wide>
      <div className="space-y-5">
        <Card>
          {store.bannerUrl && <img src={store.bannerUrl} alt="" className="mb-6 aspect-[3/1] w-full rounded-2xl object-cover" />}
          <ItemHeader image={store.logoUrl} round eyebrow="Fanitt Store" title={store.name} subtitle={store.tagline} />
          {store.about && <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{store.about}</p>}
        </Card>

        <StoreSections data={data} focusFanbox={focusFanbox} />

        <CommunityList communities={data.communities || []} />

        {data.creatorSlug && (
          <Link to={`/open/creator/${encodeURIComponent(data.creatorSlug)}`} className="flex items-center justify-center gap-2 py-2 text-[15px] font-bold text-flame">
            <UserRound size={16} /> View full profile
          </Link>
        )}
      </div>
    </BuyPage>
  );
}

/** FanBox, digital products, lives and sessions of one store (also used on the creator profile page). */
export function StoreSections({ data, focusFanbox = false }: { data: StoreData; focusFanbox?: boolean }) {
  const { store } = data;
  return (
    <>
        {!data.isOwner && <FanBox store={store} presets={data.fanbox?.presets || []} min={data.fanbox?.minAmount || 1000} max={data.fanbox?.maxAmount || 10000000} highlight={focusFanbox} />}

      {data.products.length > 0 && (
        <Card>
          <h2 className="flex items-center gap-2 font-display text-[20px] font-extrabold"><Package size={18} /> Digital products</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.products.map((p) => (
              <Link key={p._id} to={`/open/product/${p._id}`} className="flex items-center gap-3 rounded-2xl border border-ink/10 p-3 transition-colors hover:border-flame/50">
                {p.coverUrl ? <img src={p.coverUrl} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <span className="flame-bg h-14 w-14 rounded-xl" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-ink">{p.title}</span>
                  <span className="text-[13px] font-semibold text-ink-mute">{p.owned ? 'Owned' : p.price ? rupees(p.price) : 'Free'}</span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {(data.lives.length > 0 || data.meets.length > 0) && (
        <Card>
          <h2 className="flex items-center gap-2 font-display text-[20px] font-extrabold"><Radio size={18} /> Lives & sessions</h2>
          <div className="mt-4 grid gap-3">
            {data.lives.map((l) => (
              <Link key={l._id} to={`/open/live/${l._id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 p-4 transition-colors hover:border-flame/50">
                <span className="min-w-0">
                  <span className="block truncate font-bold text-ink">{l.title}</span>
                  <span className="flex items-center gap-1 text-[13px] text-ink-mute"><CalendarClock size={13} /> {l.status === 'live' ? 'Live now' : when(l.scheduledAt)}</span>
                </span>
                <span className="shrink-0 font-bold text-flame">{l.price ? rupees(l.price) : 'Free'}</span>
              </Link>
            ))}
            {data.meets.map((m) => (
              <Link key={m._id} to={`/open/session/${m._id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 p-4 transition-colors hover:border-flame/50">
                <span className="min-w-0">
                  <span className="block truncate font-bold text-ink">{m.title}</span>
                  <span className="flex items-center gap-1 text-[13px] text-ink-mute"><CalendarClock size={13} /> {when(m.scheduledAt)}</span>
                </span>
                <span className="shrink-0 font-bold text-flame">{m.price ? rupees(m.price) : 'Free'}</span>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

function FanBox({ store, presets, min, max, highlight }: { store: StoreData['store']; presets: number[]; min: number; max: number; highlight: boolean }) {
  const { session } = useAuth();
  const [amount, setAmount] = useState<number>(presets[1] || presets[0] || min);
  const [custom, setCustom] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const value = custom ? Math.round(Number(custom) * 100) : amount;
  const valid = Number.isFinite(value) && value >= min && value <= max;

  if (done) return <Done title="FanBox sent 🎁" message={`Thank you for supporting ${store.name}! They’ll see your gift and message in the app.`} />;

  const send = async () => {
    if (!valid) {
      setError(`Enter between ${rupees(min)} and ${rupees(max)}`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const outcome = await payStoreOrder('/store/fanbox', { storeId: store._id, amount: value, message: message.trim() || undefined, context: 'store' });
      if (outcome === 'done') setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className={cn(highlight && 'ring-2 ring-flame/40')}>
      <h2 className="flex items-center gap-2 font-display text-[20px] font-extrabold"><Gift size={18} /> Send a FanBox</h2>
      <p className="mt-1 text-[14px] text-ink-soft">Support {store.name} with a gift and a short message.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setAmount(p);
              setCustom('');
            }}
            className={cn(
              'h-11 rounded-full border-2 px-5 font-bold transition-all',
              !custom && amount === p ? 'border-flame bg-flame-soft/60 text-ink' : 'border-ink/10 text-ink-soft hover:border-ink/20',
            )}
          >
            {rupees(p)}
          </button>
        ))}
        <input
          inputMode="numeric"
          placeholder="Other ₹"
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').slice(0, 7))}
          className="h-11 w-28 rounded-full border-2 border-ink/10 px-4 font-bold outline-none focus:border-flame"
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 200))}
        rows={2}
        placeholder="Say something nice (optional)"
        className="mt-4 w-full rounded-2xl border border-ink/10 px-4 py-3 text-[15px] outline-none focus:border-flame focus:ring-4 focus:ring-flame/10"
      />
      <div className="mt-4">
        {session ? (
          <PayButton busy={busy} disabled={!valid} onClick={send}>Send {valid ? rupees(value) : ''}</PayButton>
        ) : (
          <LoginButton label="Log in to send a FanBox" />
        )}
      </div>
      {error && <div className="mt-4"><ErrorBox message={error} /></div>}
      <WhoAmI />
    </Card>
  );
}