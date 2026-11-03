// File: src/components/CommunityList.tsx  (fanitt-website)
import { Link } from 'react-router-dom';
import { Lock, Users } from 'lucide-react';
import { rupees } from '@/lib/format';
import { Card } from './Buy';

export type PublicCommunity = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  coverImageUrl?: string;
  visibility?: string;
  isPaid?: boolean;
  startingPrice?: number;
  memberCount?: number;
};

/** A creator's communities — each opens its join / buy page. */
export function CommunityList({ communities }: { communities: PublicCommunity[] }) {
  if (!communities.length) return null;
  return (
    <Card>
      <h2 className="flex items-center gap-2 font-display text-[20px] font-extrabold"><Users size={18} /> Communities</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {communities.map((c) => (
          <Link key={c._id} to={`/open/community/${encodeURIComponent(c.slug)}`} className="flex items-center gap-3 rounded-2xl border border-ink/10 p-3 transition-colors hover:border-flame/50">
            {c.iconUrl || c.coverImageUrl ? (
              <img src={c.iconUrl || c.coverImageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
            ) : (
              <span className="flame-bg flex h-14 w-14 items-center justify-center rounded-xl font-display text-xl font-extrabold text-white">{c.name.charAt(0).toUpperCase()}</span>
            )}
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 truncate font-bold text-ink">
                {c.visibility === 'private' && <Lock size={13} className="shrink-0 text-ink-mute" />}
                <span className="truncate">{c.name}</span>
              </span>
              <span className="text-[13px] font-semibold text-ink-mute">
                {c.isPaid ? (c.startingPrice ? `From ${rupees(c.startingPrice)}` : 'Paid') : 'Free'}
                {c.memberCount ? ` · ${c.memberCount} member${c.memberCount === 1 ? '' : 's'}` : ''}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}