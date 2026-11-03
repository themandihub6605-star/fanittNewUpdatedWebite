// File: src/pages/buy/OpenLink.tsx  (fanitt-website)
import { useParams } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { SITE } from '@/config/site';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card } from '@/components/Buy';
import CommunityBuy from './CommunityBuy';
import ProductBuy from './ProductBuy';
import LiveBuy from './LiveBuy';
import SessionBuy from './SessionBuy';
import StoreBuy from './StoreBuy';
import CreatorBuy from './CreatorBuy';

// Shared links from the app: https://fanitt.com/open/<type>/<id-or-slug>.
// With the Android app installed they open the app; otherwise (and on
// iPhone for things you can buy) this page shows it on the web.
export default function OpenLink() {
  const { type = '', id = '' } = useParams();
  const key = decodeURIComponent(id);
  switch (type) {
    case 'community':
      return <CommunityBuy slug={key} />;
    case 'product':
      return <ProductBuy id={key} />;
    case 'live':
      return <LiveBuy id={key} />;
    case 'session':
      return <SessionBuy id={key} />;
    case 'creator':
      return <CreatorBuy slug={key} />;
    case 'store':
      return <StoreBuy slug={key} />;
    case 'fanbox':
      return <StoreBuy slug={key} focusFanbox />;
    default:
      return <GetApp />;
  }
}

/** Everything else (posts, creators, campaigns…) lives in the app. */
function GetApp() {
  usePageTitle('Open in Fanitt');
  return (
    <BuyPage>
      <Card className="text-center">
        <span className="flame-bg mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] text-white">
          <Smartphone size={36} />
        </span>
        <h1 className="mt-6 font-display text-[30px] font-extrabold">Open this in Fanitt</h1>
        <p className="mx-auto mt-2 max-w-sm text-ink-soft">This link opens in the Fanitt app. Get the app and log in to see it.</p>
        <a href={SITE.playStore} target="_blank" rel="noreferrer" className="flame-bg mt-6 inline-flex h-14 items-center justify-center rounded-2xl px-8 text-[16px] font-extrabold text-white">
          Get Fanitt on Google Play
        </a>
      </Card>
    </BuyPage>
  );
}