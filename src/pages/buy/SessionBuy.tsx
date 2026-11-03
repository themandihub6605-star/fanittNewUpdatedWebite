// File: src/pages/buy/SessionBuy.tsx  (fanitt-website)
import { useState } from 'react';
import { CalendarClock, Clock, Ticket, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { paySession } from '@/lib/checkout';
import { rupees, when } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { SITE } from '@/config/site';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, Done, ErrorBox, Facts, ItemHeader, Loading, LoginButton, NotAvailable, PayButton, WhoAmI } from '@/components/Buy';

type Meet = {
  _id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  price?: number;
  scheduledAt?: string;
  durationMinutes?: number;
  maxParticipants?: number;
  bookedCount?: number;
  isCompleted?: boolean;
  isCancelled?: boolean;
  booked?: boolean;
  isHost?: boolean;
  host?: { name?: string; avatarUrl?: string } | null;
};

export default function SessionBuy({ id }: { id: string }) {
  const { session } = useAuth();
  const { data, loading, error, notFound, reload } = useLoad(() => api<{ meet: Meet }>(`/store/meets/${encodeURIComponent(id)}`).then((r) => r.data.meet), [id, session?.user._id]);
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState('');
  const [done, setDone] = useState(false);
  usePageTitle(data?.title || 'Live session', data?.description);

  if (loading && !data) return <BuyPage><Loading /></BuyPage>;
  if (notFound || (!data && error)) return <BuyPage>{notFound ? <NotAvailable what="session" /> : <ErrorBox message={error!.message} onRetry={reload} />}</BuyPage>;
  if (!data) return null;
  const m = data;
  if (done) return <BuyPage><Done title="Seat booked 🎉" message={`You’re booked for “${m.title}”${m.scheduledAt ? ` on ${when(m.scheduledAt)}` : ''}. Join from the Fanitt app.`} /></BuyPage>;

  const full = (m.maxParticipants || 0) > 0 && (m.bookedCount || 0) >= (m.maxParticipants || 0);
  const over = m.isCancelled || m.isCompleted;

  const book = async () => {
    if (!session) return;
    setBusy(true);
    setPayError('');
    try {
      const outcome = await paySession(m._id, SITE.razorpayKey, m.title, { name: session.user.name, email: session.user.email, contact: session.user.phone || '' });
      if (outcome === 'done') setDone(true);
    } catch (e) {
      setPayError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BuyPage>
      <Card>
        {m.coverImageUrl && <img src={m.coverImageUrl} alt="" className="mb-6 aspect-video w-full rounded-2xl object-cover" />}
        <ItemHeader image={m.host?.avatarUrl} round eyebrow="Live session" title={m.title} subtitle={m.host?.name ? `with ${m.host.name}` : undefined} />
        <Facts
          items={[
            !!m.scheduledAt && { icon: <CalendarClock size={14} />, text: when(m.scheduledAt) },
            !!m.durationMinutes && { icon: <Clock size={14} />, text: `${m.durationMinutes} min` },
            { icon: <Ticket size={14} />, text: m.price ? rupees(m.price) : 'Free' },
            !!m.maxParticipants && { icon: <Users size={14} />, text: `${m.bookedCount || 0} / ${m.maxParticipants} booked` },
          ]}
        />
        {m.description && <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{m.description}</p>}

        <div className="mt-7">
          {over ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">{m.isCancelled ? 'This session was cancelled.' : 'This session has ended.'}</p>
          ) : m.isHost ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">You’re hosting this session.</p>
          ) : m.booked ? (
            <p className="rounded-2xl bg-emerald-50 p-4 text-[14px] font-bold text-emerald-700">You’re booked. Join from the Fanitt app at the start time.</p>
          ) : full ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">All seats are booked.</p>
          ) : session ? (
            <PayButton busy={busy} onClick={book}>{m.price ? `Book seat · ${rupees(m.price)}` : 'Book free seat'}</PayButton>
          ) : (
            <LoginButton label={m.price ? `Log in to book · ${rupees(m.price)}` : 'Log in to book'} />
          )}
          {payError && <div className="mt-4"><ErrorBox message={payError} /></div>}
          <WhoAmI />
        </div>
      </Card>
    </BuyPage>
  );
}