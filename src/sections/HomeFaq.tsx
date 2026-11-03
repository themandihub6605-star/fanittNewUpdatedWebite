// File: src/sections/HomeFaq.tsx  (fanitt-website)
import { Link } from 'react-router-dom';
import { FAQ } from '@/config/faq';
import { Accordion } from '@/components/Accordion';
import { Magnetic, Reveal, RevealWords } from '@/components/motion';

const PICKS = [FAQ[0].items[0], FAQ[1].items[0], FAQ[2].items[0], FAQ[1].items[1], FAQ[3].items[0]];

export function HomeFaq() {
  return (
    <section className="py-20 lg:py-28">
      <div className="page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <RevealWords text="Questions, answered." className="text-[38px] font-extrabold leading-[1.02] sm:text-[52px]" />
          <p className="mt-4 text-[17px] text-ink-soft">Can’t find yours?</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/faq" className="group relative inline-flex h-12 items-center overflow-hidden rounded-2xl bg-ink px-6 text-[15px] font-bold text-white">
                <span className="flame-bg absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative">All questions</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="inline-flex h-12 items-center rounded-2xl border border-ink/15 px-6 text-[15px] font-bold transition-colors duration-300 hover:border-flame hover:text-flame">
                Contact us
              </Link>
            </Magnetic>
          </div>
        </div>
        <Reveal from="blur">
          <Accordion items={PICKS} />
        </Reveal>
      </div>
    </section>
  );
}