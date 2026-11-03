// File: src/pages/buy/ProductBuy.tsx  (fanitt-website)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Store } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { payStoreOrder } from '@/lib/checkout';
import { rupees } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, Done, ErrorBox, Facts, ItemHeader, Loading, LoginButton, NotAvailable, PayButton, WhoAmI } from '@/components/Buy';

type Product = { _id: string; title: string; description?: string; coverUrl?: string; price: number; isFree?: boolean; fileCount?: number; totalSize?: number; category?: string };
type Data = { product: Product; store: { name: string; slug: string; logoUrl?: string }; owned: boolean; isOwner: boolean };

function size(bytes = 0) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function ProductBuy({ id }: { id: string }) {
  const { session } = useAuth();
  const { data, loading, error, notFound, reload } = useLoad(() => api<Data>(`/store/products/${encodeURIComponent(id)}`).then((r) => r.data), [id, session?.user._id]);
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState('');
  const [done, setDone] = useState(false);
  usePageTitle(data?.product.title || 'Product', data?.product.description);

  if (loading && !data) return <BuyPage><Loading /></BuyPage>;
  if (notFound || (!data && error)) return <BuyPage>{notFound ? <NotAvailable what="product" /> : <ErrorBox message={error!.message} onRetry={reload} />}</BuyPage>;
  if (!data) return null;
  const { product: p, store } = data;
  if (done) return <BuyPage><Done title="It’s yours! 🎉" message={`“${p.title}” is in your library. Open the Fanitt app → My library to download it.`} /></BuyPage>;

  const buy = async () => {
    setBusy(true);
    setPayError('');
    try {
      if ((await payStoreOrder(`/store/products/${p._id}/checkout`)) === 'done') setDone(true);
    } catch (e) {
      setPayError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BuyPage>
      <Card>
        {p.coverUrl && <img src={p.coverUrl} alt="" className="mb-6 aspect-[16/10] w-full rounded-2xl object-cover" />}
        <ItemHeader
          image={store.logoUrl}
          round
          eyebrow="Digital product"
          title={p.title}
          subtitle={
            <Link to={`/open/store/${store.slug}`} className="inline-flex items-center gap-1 font-semibold hover:text-flame">
              <Store size={14} /> {store.name}
            </Link>
          }
        />
        <Facts
          items={[
            !!p.fileCount && { icon: <FileText size={14} />, text: `${p.fileCount} file${p.fileCount === 1 ? '' : 's'}${p.totalSize ? ` · ${size(p.totalSize)}` : ''}` },
            { icon: <Download size={14} />, text: 'Download in the app' },
          ]}
        />
        {p.description && <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{p.description}</p>}

        <div className="mt-7">
          {data.isOwner ? (
            <p className="rounded-2xl bg-sand p-4 text-[14px] font-semibold text-ink-soft">This is your product.</p>
          ) : data.owned ? (
            <p className="rounded-2xl bg-emerald-50 p-4 text-[14px] font-bold text-emerald-700">You own this. Find it in the Fanitt app → My library.</p>
          ) : session ? (
            <PayButton busy={busy} onClick={buy}>{p.price > 0 ? `Buy for ${rupees(p.price)}` : 'Get it free'}</PayButton>
          ) : (
            <LoginButton label={p.price > 0 ? `Log in to buy · ${rupees(p.price)}` : 'Log in to get it'} />
          )}
          {payError && <div className="mt-4"><ErrorBox message={payError} /></div>}
          <WhoAmI />
        </div>
      </Card>
    </BuyPage>
  );
}