// File: src/pages/buy/CreatorBuy.tsx  (fanitt-website)
import { Link } from 'react-router-dom';
import { CalendarClock, MapPin, Radio, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { rupees, when } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, ErrorBox, ItemHeader, Loading, NotAvailable } from '@/components/Buy';
import { CommunityList, type PublicCommunity } from '@/components/CommunityList';
import { DownloadButtons } from '@/components/PlayButton';
import { StoreSections, type StoreData } from './StoreBuy';

type Profile = {
  creator: {
    slug: string;
    title?: string;
    bio?: string;
    location?: string;
    coverImageUrl?: string;
    user?: { name?: string; avatarUrl?: string };
  };
  sessions: Array<{ _id: string; title: string; price?: number; scheduledAt?: string; coverImageUrl?: string }>;
  store: { slug: string; name: string } | null;
  communities?: PublicCommunity[];
};

/**
 * A creator's public page — the one link they share anywhere. Everything you
 * can buy from them in one place: FanBox, digital products, lives, live
 * sessions and communities. Buying needs a quick email-code login.
 */
export default function CreatorBuy({ slug }: { slug: string }) {
  const { session } = useAuth();
  const { data, loading, error, notFound, reload } = useLoad(async () => {
    const profile = (await api<Profile>(`/creators/${encodeURIComponent(slug)}`)).data;
    let store: StoreData | null = null;
    if (profile.store?.slug) {
      try {
        store = (await api<StoreData>(`/store/stores/${encodeURIComponent(profile.store.slug)}`)).data;
      } catch {
        store = null; // store closed / hidden — show the rest of the profile
      }
    }
    return { profile, store };
  }, [slug, session?.user._id]);

  const name = data?.profile.creator.user?.name || 'Creator';
  usePageTitle(name, data?.profile.creator.title);

  if (loading && !data) return <BuyPage><Loading /></BuyPage>;
  if (notFound || (!data && error)) return <BuyPage>{notFound ? <NotAvailable what="profile" /> : <ErrorBox message={error!.message} onRetry={reload} />}</BuyPage>;
  if (!data) return null;

  const { profile, store } = data;
  const c = profile.creator;
  const communities = profile.communities || [];
  // Without a store, the profile's own upcoming sessions are shown.
  const sessions = store ? [] : profile.sessions || [];
  const hasStore = !!store && (store.products.length > 0 || store.lives.length > 0 || store.meets.length > 0 || !store.isOwner);
  const empty = !hasStore && !sessions.length && !communities.length;

  return (
    <BuyPage wide>
      <div className="space-y-5">
        <Card>
          {c.coverImageUrl && <img src={c.coverImageUrl} alt="" className="mb-6 aspect-[3/1] w-full rounded-2xl object-cover" />}
          <ItemHeader
            image={c.user?.avatarUrl}
            round
            eyebrow="Creator on Fanitt"
            title={name}
            subtitle={
              <>
                {c.title && <span className="block">{c.title}</span>}
                {c.location && (
                  <span className="mt-1 flex items-center gap-1 text-[13px] text-ink-mute">
                    <MapPin size={13} /> {c.location}
                  </span>
                )}
              </>
            }
          />
          {c.bio && <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{c.bio}</p>}
        </Card>

        {store && <StoreSections data={store} />}

        {sessions.length > 0 && (
          <Card>
            <h2 className="flex items-center gap-2 font-display text-[20px] font-extrabold"><Radio size={18} /> Live sessions</h2>
            <div className="mt-4 grid gap-3">
              {sessions.map((m) => (
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

        <CommunityList communities={communities} />

        {empty && (
          <Card className="text-center">
            <span className="flame-bg mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] text-white">
              <Smartphone size={28} />
            </span>
            <h2 className="mt-4 font-display text-[22px] font-extrabold">Nothing to buy here yet</h2>
            <p className="mx-auto mt-1 max-w-sm text-ink-soft">Follow {name} and see their posts in the Fanitt app.</p>
            <div className="mt-5 flex justify-center">
              <DownloadButtons />
            </div>
          </Card>
        )}
      </div>
    </BuyPage>
  );
}