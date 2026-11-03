// File: src/pages/buy/LiveBuy.tsx  (fanitt-website)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Radio, Ticket } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { payStoreOrder } from '@/lib/checkout';
import { rupees, when } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, Done, ErrorBox, Facts, ItemHeader, Loading, LoginButton, NotAvailable, PayButton, WhoAmI } from '@/components/Buy';

type Live = { _id: string; title: string; description?: string; coverUrl?: string; price?: number; status: string; scheduledAt?: string; visibility?: string };
type Data = {
  live: Live;
  store?: { name?: string; slug?: string; logoUrl?: string } | null;
  access?: { allowed?: boolean; needsTicket?: boolean; isHost?: boolean; reason?: string };
};

export default function LiveBuy({ id }: { id: string }) {
  const { session } = useAuth();
  const { data, loading, error, notFound, reload } = useLoad(() => api<Data>(`/store/lives/${encodeURIComponent(id)}`).then((r) => r.data), [id, session?.user._id]);
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState('');
  const [done, setDone] = useState(false);
  usePageTitle(data?.live.title || 'Live', data?.live.description);

  if (loading && !data) return <BuyPage><Loading /></BuyPage>;
  if (notFound || (!data && error)) return <BuyPage>{notFound ? <NotAvailable what="live" /> : <ErrorBox message={error!.message} onRetry={reload} />}</BuyPage>;
  if (!data) return null;
  const { live, store, access = {} } = data;
  if (done) return <BuyPage><Done title="Ticket confirmed 🎟️" message={`You’re in for “${live.title}”. Open the Fanitt app at the start time to watch.`} /></BuyPage>;

  const ended = !['scheduled', 'live'].includes(live.status);
  const isPrivate = access.reason === 'private';

  const buy = async () => {
    setBusy(true);
    setPayError('');
    try {
      if ((await payStoreOrder(`/store/lives/${live._id}/checkout`)) === 'done') setDone(true);
    } catch (e) {
      setPayError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BuyPage>
      <Card>
        {live.coverUrl && <img src={live.coverUrl} alt="" className="mb-6 aspect-video w-full rounded-2xl object-cover" />}
        <ItemHeader
          image={store?.logoUrl}
          round
          eyebrow={live.status === 'live' ? '● Live now' : 'Live'}
          title={live.title}
          subtitle={store?.slug ? <Link to={`/open/store/${store.slug}`} className="font-semibold hover:text-flame">{store.name}</Link> : store?.name}
        />
        <Facts
          items={[
            !!live.scheduledAt && { icon: <CalendarClock size={14} />, text: when(live.scheduledAt) },
            { icon: <Ticket size={14} />, text: live.price ? rupees(live.price) : 'Free' },
            live.status === 'live' && { icon: <Radio size={14} />, text: 'Happening now' },
          ]}
        />
        {live.description && <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{live.description}</p>}

        <div className="mt-7">
          {ended ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">This live has finished.</p>
          ) : isPrivate ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">This live is private.</p>
          ) : access.isHost ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">You’re hosting this live.</p>
          ) : access.allowed ? (
            <p className="rounded-2xl bg-emerald-50 p-4 text-[14px] font-bold text-emerald-700">You have a ticket. Open the Fanitt app to watch.</p>
          ) : session ? (
            <PayButton busy={busy} onClick={buy}>{live.price ? `Buy ticket · ${rupees(live.price)}` : 'Get free ticket'}</PayButton>
          ) : (
            <LoginButton label={live.price ? `Log in to buy · ${rupees(live.price)}` : 'Log in to get a ticket'} />
          )}
          {payError && <div className="mt-4"><ErrorBox message={payError} /></div>}
          <WhoAmI />
        </div>
      </Card>
    </BuyPage>
  );
}