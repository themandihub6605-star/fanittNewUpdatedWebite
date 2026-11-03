import { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SITE } from '@/config/site';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/components/cn';
import { LEGAL_ROUTES, useLegalDoc, useLegalList, type LegalBlock } from '@/components/useLegal';
import { usePageTitle } from '@/components/usePageTitle';

const TITLES: Record<string, string> = {
  'privacy-policy': 'Privacy Policy',
  'terms-of-use': 'Terms of Use',
  'refund-policy': 'Refund & Cancellation Policy',
};

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  // Group consecutive list items so they render as real lists.
  const out: JSX.Element[] = [];
  for (let i = 0; i < blocks.length; ) {
    const b = blocks[i];
    if (b.type === 'li' || b.type === 'ol') {
      const kind = b.type;
      const start = i;
      const items: LegalBlock[] = [];
      while (i < blocks.length && blocks[i].type === kind) items.push(blocks[i++]);
      const List = kind === 'ol' ? 'ol' : 'ul';
      out.push(
        <List key={`list-${start}`} className={cn('space-y-2 pl-5 text-[16px] leading-relaxed text-ink-soft', kind === 'ol' ? 'list-decimal' : 'list-disc marker:text-flame')}>
          {items.map((it, k) => (
            <li key={k} className="pl-1">
              {it.text}
            </li>
          ))}
        </List>,
      );
      continue;
    }
    out.push(
      b.type === 'h' ? (
        <h3 key={`h-${i}`} className="pt-2 font-sans text-[17px] font-bold tracking-[-0.01em] text-ink">
          {b.text}
        </h3>
      ) : (
        <p key={`p-${i}`} className="text-[16px] leading-relaxed text-ink-soft">
          {b.text}
        </p>
      ),
    );
    i += 1;
  }
  return <div className="space-y-4">{out}</div>;
}

export default function Legal({ slug }: { slug: string }) {
  const { doc, error, loading } = useLegalDoc(slug);
  const list = useLegalList();
  const title = doc?.title || TITLES[slug] || 'Legal';
  usePageTitle(title);

  return (
    <>
      <PageHeader title={title} intro={doc?.subtitle || undefined}>
        {(doc?.updated || doc?.effective) && (
          <p className="mt-4 text-[14px] font-medium text-ink-mute">
            {doc.updated && <>Last updated {doc.updated}</>}
            {doc.updated && doc.effective && <span className="mx-2">/</span>}
            {doc.effective && <>Effective {doc.effective}</>}
          </p>
        )}
        {list.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {list.map((l) => (
              <NavLink
                key={l.slug}
                to={LEGAL_ROUTES[l.slug] || `/legal/${l.slug}`}
                className={({ isActive }) =>
                  cn('inline-flex h-11 items-center rounded-full px-5 text-[14.5px] font-bold transition-colors', isActive ? 'bg-ink text-white' : 'bg-sand text-ink-soft hover:text-ink')
                }
              >
                {l.title}
              </NavLink>
            ))}
          </div>
        )}
      </PageHeader>

      <section className="pb-24">
        <div className="page">
          {loading && (
            <div className="max-w-3xl space-y-4" aria-busy>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-sand" style={{ width: `${70 + ((i * 37) % 30)}%` }} />
              ))}
            </div>
          )}

          {error && (
            <div className="max-w-xl rounded-[28px] bg-sand p-8">
              <h2 className="text-[24px] font-extrabold">{error === 'missing' ? 'This document isn’t published yet.' : 'This page couldn’t load.'}</h2>
              <p className="mt-2 text-ink-soft">
                {error === 'missing' ? 'For questions about it, contact us at ' : 'Check your connection and refresh, or contact us at '}
                <a href={`mailto:${SITE.email}`} className="font-bold text-flame">
                  {SITE.email}
                </a>
                .
              </p>
              <Link to="/" className="mt-6 inline-flex h-12 items-center rounded-2xl bg-ink px-6 text-[15px] font-bold text-white">
                Go to the home page
              </Link>
            </div>
          )}

          {doc && (
            <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
              <nav aria-label="Sections" className="hidden lg:block">
                <ol className="sticky top-28 max-h-[calc(100vh-140px)] space-y-0.5 overflow-y-auto pr-2 [scrollbar-width:thin]">
                  {doc.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex gap-2 rounded-xl px-3 py-2 text-[14px] font-semibold text-ink-soft transition-colors hover:bg-sand hover:text-ink">
                        <span className="text-flame">{s.number}</span>
                        <span>{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <article className="max-w-3xl space-y-14">
                {doc.intro.length > 0 && <Blocks blocks={doc.intro} />}
                {doc.sections.map((s) => (
                  <Fragment key={s.id}>
                    <section id={s.id} className="scroll-mt-28">
                      <h2 className="flex gap-3 text-[24px] font-extrabold leading-tight sm:text-[28px]">
                        <span className="text-flame">{s.number}</span>
                        <span>{s.title}</span>
                      </h2>
                      <div className="mt-5">
                        <Blocks blocks={s.blocks} />
                      </div>
                    </section>
                  </Fragment>
                ))}
              </article>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
