// File: src/pages/buy/CommunityBuy.tsx  (fanitt-website)
import { useState } from 'react';
import { Crown, Lock, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { payStoreOrder } from '@/lib/checkout';
import { rupees } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, Done, ErrorBox, Facts, ItemHeader, Loading, LoginButton, NotAvailable, PayButton, WhoAmI } from '@/components/Buy';
import { cn } from '@/components/cn';

type Plan = { key: 'monthly' | 'yearly' | 'lifetime'; label: string; price: number };
type Community = {
  _id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  coverImageUrl?: string;
  memberCount?: number;
  isPaid?: boolean;
  isOwner?: boolean;
  planOptions?: Plan[];
  membership?: { status: string; role: string; access: string; plan?: string | null; paidUntil?: string | null } | null;
  createdBy?: { name?: string } | null;
};

const PER: Record<Plan['key'], string> = { monthly: '/ month', yearly: '/ year', lifetime: 'one time' };

function hasAccess(c: Community) {
  const m = c.membership;
  if (!m || m.status !== 'active') return false;
  if (m.role !== 'member' || m.access !== 'paid') return true;
  if (m.plan === 'lifetime') return true;
  return !m.paidUntil || new Date(m.paidUntil).getTime() > Date.now();
}

export default function CommunityBuy({ slug }: { slug: string }) {
  const { session } = useAuth();
  const { data: c, loading, error, notFound, reload } = useLoad(() => api<Community>(`/communities/${encodeURIComponent(slug)}`).then((r) => r.data), [slug, session?.user._id]);
  const [plan, setPlan] = useState<Plan['key'] | null>(null);
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState('');
  const [done, setDone] = useState(false);
  usePageTitle(c?.name || 'Community', c?.description);

  if (loading && !c) return <BuyPage><Loading /></BuyPage>;
  if (notFound || (!c && error)) return <BuyPage>{notFound ? <NotAvailable what="community" /> : <ErrorBox message={error!.message} onRetry={reload} />}</BuyPage>;
  if (!c) return null;
  if (done) return <BuyPage><Done title="You’re in! 🎉" message={`Welcome to ${c.name}. Open the Fanitt app to read posts and chat with members.`} /></BuyPage>;

  const plans = c.planOptions || [];
  const chosen = plans.find((p) => p.key === plan) || plans[0];
  const member = hasAccess(c);

  const join = async () => {
    if (!chosen) return;
    setBusy(true);
    setPayError('');
    try {
      if ((await payStoreOrder(`/communities/${c._id}/checkout`, { plan: chosen.key })) === 'done') setDone(true);
    } catch (e) {
      setPayError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const joinFree = async () => {
    setBusy(true);
    setPayError('');
    try {
      await api(`/communities/${c._id}/join`, { body: {} });
      setDone(true);
    } catch (e) {
      setPayError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BuyPage>
      <Card>
        <ItemHeader
          image={c.iconUrl || c.coverImageUrl}
          eyebrow={c.isPaid ? 'Members-only community' : 'Community'}
          title={c.name}
          subtitle={c.createdBy?.name ? `by ${c.createdBy.name}` : undefined}
        />
        <Facts
          items={[
            { icon: <Users size={14} />, text: `${(c.memberCount || 0).toLocaleString('en-IN')} members` },
            c.isPaid && { icon: <Lock size={14} />, text: 'Paid access' },
          ]}
        />
        {c.description && <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{c.description}</p>}

        <div className="mt-7">
          {c.isOwner ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">This is your community.</p>
          ) : member ? (
            <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-[14px] font-bold text-emerald-700">
              <Crown size={16} /> You’re a member. Open the Fanitt app to join in.
            </p>
          ) : !c.isPaid ? (
            session ? <PayButton busy={busy} onClick={joinFree}>Join for free</PayButton> : <LoginButton label="Log in to join" />
          ) : plans.length === 0 ? (
            <p className="text-ink-soft">This community isn’t taking new members right now.</p>
          ) : (
            <>
              <p className="mb-3 text-[14px] font-bold text-ink">Choose a plan</p>
              <div className="grid gap-3">
                {plans.map((p) => {
                  const on = (chosen?.key ?? '') === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPlan(p.key)}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all',
                        on ? 'border-flame bg-flame-soft/50' : 'border-ink/10 bg-white hover:border-ink/20',
                      )}
                    >
                      <span className="font-bold text-ink">{p.label}</span>
                      <span>
                        <b className="font-display text-[20px] text-ink">{rupees(p.price)}</b>
                        <span className="ml-1 text-[13px] text-ink-mute">{PER[p.key]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5">
                {session ? (
                  <PayButton busy={busy} onClick={join}>
                    Pay {chosen ? rupees(chosen.price) : ''} & join
                  </PayButton>
                ) : (
                  <LoginButton label="Log in to join" />
                )}
              </div>
            </>
          )}
          {payError && <div className="mt-4"><ErrorBox message={payError} /></div>}
          <WhoAmI />
        </div>
      </Card>
    </BuyPage>
  );
}