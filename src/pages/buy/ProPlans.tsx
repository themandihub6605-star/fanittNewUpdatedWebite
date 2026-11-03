// File: src/pages/buy/ProPlans.tsx  (fanitt-website)
import { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { payPlan } from '@/lib/checkout';
import { rupees } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, Done, ErrorBox, Loading, LoginButton, PayButton, WhoAmI } from '@/components/Buy';
import { cn } from '@/components/cn';

type Plan = { _id: string; name: string; appliesTo: 'creator' | 'brand'; price: number; billingCycle: string; description?: string; isDefault?: boolean };
type MySub = { plan?: { _id: string; name: string; price: number } | null; status?: string; currentPeriodEnd?: string | null };

const CYCLE: Record<string, string> = { monthly: '/ month', yearly: '/ year', quarterly: '/ 3 months' };

/** Fanitt plans for creators and brands. */
export default function ProPlans() {
  usePageTitle('Fanitt plans', 'Upgrade your Fanitt plan.');
  const { session } = useAuth();
  const role = session?.user.role;
  const appliesTo = role === 'brand' ? 'brand' : 'creator';
  const { data, loading, error, reload } = useLoad(async () => {
    const plans = (await api<Plan[]>(`/subscriptions/plans?appliesTo=${appliesTo}`, { auth: false })).data;
    const mine = session && (role === 'creator' || role === 'brand') ? (await api<MySub>('/subscriptions/me')).data : null;
    return { plans, mine };
  }, [appliesTo, session?.user._id]);
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState('');
  const [done, setDone] = useState<string | null>(null);

  if (done) return <BuyPage><Done title={`You’re on ${done} 🎉`} message="Your new plan is active. Open the Fanitt app to use it." /></BuyPage>;

  const plans = (data?.plans || []).filter((p) => p.price > 0);
  const currentId = data?.mine?.plan?._id;
  const chosen = plans.find((p) => p._id === picked) || plans.find((p) => p._id !== currentId) || plans[0];
  const canBuy = role === 'creator' || role === 'brand';

  const buy = async () => {
    if (!chosen || !session) return;
    setBusy(true);
    setPayError('');
    try {
      const outcome = await payPlan(chosen._id, { name: session.user.name, email: session.user.email, contact: session.user.phone || '' });
      if (outcome === 'done') setDone(chosen.name);
    } catch (e) {
      setPayError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BuyPage wide>
      <Card>
        <span className="flame-bg flex h-14 w-14 items-center justify-center rounded-2xl text-white"><Crown size={24} /></span>
        <h1 className="mt-5 font-display text-[32px] font-extrabold leading-tight">Fanitt plans</h1>
        <p className="mt-2 text-ink-soft">
          {session ? (role === 'brand' ? 'Plans for brands.' : 'Plans for creators.') : 'Log in to see the plans for your account.'}
          {data?.mine?.plan?.name ? <> You’re on <b className="text-ink">{data.mine.plan.name}</b>.</> : null}
        </p>

        {loading && !data ? (
          <Loading />
        ) : error ? (
          <div className="mt-6"><ErrorBox message={error.message} onRetry={reload} /></div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {plans.map((p) => {
                const current = p._id === currentId;
                const on = chosen?._id === p._id;
                return (
                  <button
                    key={p._id}
                    type="button"
                    disabled={current}
                    onClick={() => setPicked(p._id)}
                    className={cn(
                      'rounded-2xl border-2 p-5 text-left transition-all disabled:cursor-default',
                      current ? 'border-emerald-300 bg-emerald-50' : on ? 'border-flame bg-flame-soft/50' : 'border-ink/10 hover:border-ink/20',
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-display text-[20px] font-extrabold text-ink">{p.name}</span>
                      {current ? <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[12px] font-bold text-white">Current</span> : on && <Check size={18} className="text-flame" />}
                    </span>
                    <span className="mt-2 block">
                      <b className="font-display text-[26px] text-ink">{rupees(p.price)}</b>
                      <span className="ml-1 text-[13px] text-ink-mute">{CYCLE[p.billingCycle] || ''}</span>
                    </span>
                    {p.description && <span className="mt-2 block text-[14px] text-ink-soft">{p.description}</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-6">
              {!session ? (
                <LoginButton label="Log in to upgrade" />
              ) : !canBuy ? (
                <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">Plans are for creator and brand accounts.</p>
              ) : chosen && chosen._id !== currentId ? (
                <PayButton busy={busy} onClick={buy}>Get {chosen.name} · {rupees(chosen.price)}</PayButton>
              ) : null}
              {payError && <div className="mt-4"><ErrorBox message={payError} /></div>}
              <WhoAmI />
            </div>
          </>
        )}
      </Card>
    </BuyPage>
  );
}