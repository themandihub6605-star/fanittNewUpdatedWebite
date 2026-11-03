// File: src/pages/buy/Account.tsx  (fanitt-website)
import { Link, Navigate } from 'react-router-dom';
import { Crown, LogOut, Receipt } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { rupees, when } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, ErrorBox, Loading } from '@/components/Buy';
import { SITE } from '@/config/site';

type Order = { _id: string; itemType: string; itemTitle: string; itemCoverUrl?: string; amount: number; status: string; paidAt?: string };

const TYPE: Record<string, string> = {
  digital_product: 'Digital product',
  live_stream: 'Live ticket',
  fanbox: 'FanBox',
  community: 'Community',
  call: 'Call',
};

/** Logged-in page on the website: who you are + what you bought. */
export default function Account() {
  usePageTitle('Your account');
  const { session, logout } = useAuth();
  const { data, loading, error, reload } = useLoad(
    () => (session ? api<{ orders: Order[] }>('/store/orders/mine').then((r) => r.data.orders) : Promise.resolve([] as Order[])),
    [session?.user._id],
  );

  if (!session) return <Navigate to="/login?next=%2Faccount" replace />;
  const u = session.user;
  const canUpgrade = u.role === 'creator' || u.role === 'brand';

  return (
    <BuyPage>
      <div className="space-y-5">
        <Card>
          <div className="flex items-center gap-4">
            {u.avatarUrl ? (
              <img src={u.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flame-bg flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-extrabold text-white">{(u.name || '?').charAt(0).toUpperCase()}</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[24px] font-extrabold">{u.name}</p>
              <p className="truncate text-[14px] text-ink-mute">{u.email}</p>
            </div>
            <button type="button" onClick={logout} className="flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-[14px] font-bold text-ink-soft hover:border-ink/30">
              <LogOut size={15} /> Log out
            </button>
          </div>
          {canUpgrade && (
            <Link to="/pro" className="mt-5 flex items-center gap-2 rounded-2xl bg-sand p-4 font-bold text-ink hover:text-flame">
              <Crown size={18} /> Fanitt plans
            </Link>
          )}
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-display text-[20px] font-extrabold"><Receipt size={18} /> Your purchases</h2>
          {loading && !data ? (
            <Loading />
          ) : error ? (
            <div className="mt-4"><ErrorBox message={error.message} onRetry={reload} /></div>
          ) : !data?.length ? (
            <p className="mt-3 text-ink-soft">Nothing yet. Things you buy on Fanitt show up here and in the app.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/[0.06]">
              {data.map((o) => (
                <li key={o._id} className="flex items-center gap-3 py-3">
                  {o.itemCoverUrl ? <img src={o.itemCoverUrl} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <span className="flame-bg h-12 w-12 rounded-xl" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink">{o.itemTitle}</span>
                    <span className="text-[13px] text-ink-mute">{TYPE[o.itemType] || 'Purchase'} · {when(o.paidAt)}{o.status === 'refunded' ? ' · Refunded' : ''}</span>
                  </span>
                  <span className="shrink-0 font-bold text-ink">{rupees(o.amount)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 text-[13px] text-ink-mute">
            Everything you buy is unlocked in the Fanitt app when you log in with {u.email}. Need help? <a href={`mailto:${SITE.email}`} className="font-bold text-flame">{SITE.email}</a>
          </p>
          <Link to="/delete-account" className="mt-3 inline-block text-[13px] font-semibold text-ink-mute underline-offset-2 hover:text-red-600 hover:underline">
            Delete my account
          </Link>
        </Card>
      </div>
    </BuyPage>
  );
}