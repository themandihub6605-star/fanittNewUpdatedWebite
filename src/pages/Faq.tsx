// File: src/pages/Faq.tsx  (fanitt-website)
import { Link } from 'react-router-dom';
import { FAQ } from '@/config/faq';
import { Accordion } from '@/components/Accordion';
import { PageHeader } from '@/components/PageHeader';
import { usePageTitle } from '@/components/usePageTitle';
import { Reveal, Spotlight } from '@/components/motion';

export default function Faq() {
  usePageTitle('FAQ', 'Answers to common questions about Fanitt.');
  return (
    <>
      <PageHeader title="Questions, answered." intro="Everything people usually ask about Fanitt. Still stuck? Our team is a message away." />
      <section className="pb-24">
        <div className="page grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav className="hidden lg:block">
            <ul className="sticky top-28 space-y-1">
              {FAQ.map((g) => (
                <li key={g.group}>
                  <a href={`#${g.group.replace(/\W+/g, '-').toLowerCase()}`} className="block rounded-xl px-4 py-2.5 text-[15px] font-semibold text-ink-soft transition-all duration-300 hover:translate-x-1 hover:bg-sand hover:text-flame">
                    {g.group}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {FAQ.map((g) => (
              <Reveal key={g.group} from="blur" className="scroll-mt-28">
              <div id={g.group.replace(/\W+/g, '-').toLowerCase()} className="scroll-mt-28">
                <h2 className="text-[28px] font-extrabold sm:text-[34px]">{g.group}</h2>
                <Accordion items={g.items} className="mt-4" />
              </div>
              </Reveal>
            ))}
            <Spotlight className="rounded-[28px] bg-sand p-8 sm:p-10">
              <h2 className="text-[26px] font-extrabold">Didn’t find your answer?</h2>
              <p className="mt-2 text-ink-soft">Send us a message and we will get back to you.</p>
              <Link to="/contact" className="mt-6 inline-flex h-12 items-center rounded-2xl bg-ink px-6 text-[15px] font-bold text-white">
                Contact us
              </Link>
            </Spotlight>
          </div>
        </div>
      </section>
    </>
  );
}