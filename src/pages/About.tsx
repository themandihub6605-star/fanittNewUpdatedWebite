// File: src/pages/About.tsx  (fanitt-website)
import { SCREENS, SITE } from '@/config/site';
import { Phone } from '@/components/Phone';
import { PageHeader } from '@/components/PageHeader';
import { Cta } from '@/sections/Cta';
import { usePageTitle } from '@/components/usePageTitle';
import { motion } from 'framer-motion';
import { Parallax, Reveal, RevealWords, Spotlight, Stagger, StaggerItem } from '@/components/motion';

const BELIEFS = [
  { title: 'Creators deserve to be paid fairly', text: 'Talent should turn into income without a middleman taking control of the relationship.' },
  { title: 'Brands deserve to know what they get', text: 'Clear briefs, verified creators and escrow payments take the guesswork out of creator marketing.' },
  { title: 'Fans want more than a like button', text: 'Real conversations, calls and live sessions bring people closer to the creators they follow.' },
];

export default function About() {
  usePageTitle('About', 'Fanitt is built in Bengaluru for India’s creator economy.');
  return (
    <>
      <PageHeader
        title="Built in India, for the people who create."
        intro="Fanitt brings creators, brands, fans and agencies into one app — so making a living from your talent feels simple, safe and fair."
      />

      <section className="py-12 lg:py-20">
        <div className="page grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal from="blur" className="space-y-6 text-[17px] leading-relaxed text-ink-soft">
            <p>
              Millions of Indians create every day — reels, tutorials, music, fitness, food, travel. But turning that into income still
              means chasing brands on DMs, sharing bank details with strangers and hoping a payment arrives.
            </p>
            <p>
              We built Fanitt to fix that. Creators get a store for their time and work. Brands get verified creators and payments held in
              escrow. Fans get a real way to connect. Agencies get a clear way to grow with the creators they bring.
            </p>
            <p>
              Fanitt is a product of <span className="font-bold text-ink">{SITE.company}</span>, based in {SITE.city}.
            </p>
          </Reveal>
          <div className="relative mx-auto flex w-full max-w-[460px] justify-center">
            <Parallax distance={40} className="w-[50%]">
              <motion.div initial={{ opacity: 0, rotate: -16, x: -40 }} whileInView={{ opacity: 1, rotate: -6, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} whileHover={{ rotate: -9, y: -10 }}>
                <Phone src={SCREENS.feed} alt="The Fanitt feed" />
              </motion.div>
            </Parallax>
            <Parallax distance={-30} className="-ml-[10%] mt-14 w-[50%]">
              <motion.div initial={{ opacity: 0, rotate: 16, x: 40 }} whileInView={{ opacity: 1, rotate: 6, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 }} whileHover={{ rotate: 9, y: -10 }}>
                <Phone src={SCREENS.profile} alt="A creator profile on Fanitt" />
              </motion.div>
            </Parallax>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="page">
          <RevealWords text="What we believe" className="text-[36px] font-extrabold leading-[1.02] sm:text-[50px]" />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {BELIEFS.map((b) => (
              <StaggerItem key={b.title} className="h-full">
                <Spotlight className="h-full rounded-[28px] border border-ink/[0.06] bg-white p-8 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(14,22,48,0.35)]">
                  <span className="block h-1.5 w-12 rounded-full bg-gradient-to-r from-flame to-rose transition-all duration-500 group-hover/spot:w-24" />
                  <h3 className="mt-6 text-[24px] font-extrabold leading-tight">{b.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{b.text}</p>
                </Spotlight>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Cta />
    </>
  );
}