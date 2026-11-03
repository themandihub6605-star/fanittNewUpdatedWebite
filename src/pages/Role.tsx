// File: src/pages/Role.tsx  (fanitt-website)
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ROLES, ROLE_PAGES, type RoleKey } from '@/config/roles';
import { Phone } from '@/components/Phone';
import { DownloadButtons } from '@/components/PlayButton';
import { Cta } from '@/sections/Cta';
import { usePageTitle } from '@/components/usePageTitle';
import { RevealWords, Spotlight, Stagger, StaggerItem } from '@/components/motion';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Role({ role }: { role: RoleKey }) {
  const base = ROLES[role];
  const page = ROLE_PAGES[role];
  usePageTitle(`Fanitt for ${base.label.toLowerCase()}`, page.intro);

  return (
    <div key={role}>
      {/* hero */}
      <section className="relative overflow-hidden pb-10 pt-28 sm:pt-36 lg:pb-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-flame/25 blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 top-60 h-80 w-80 rounded-full bg-rose/15 blur-[100px]" />
        <div className="page relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex rounded-full bg-flame-soft px-4 py-1.5 text-[14px] font-bold text-flame-deep"
            >
              Fanitt for {base.label.toLowerCase()}
            </motion.p>
            <RevealWords as="h1" text={page.headline} delay={0.05} className="mt-5 text-[44px] font-extrabold leading-[1] sm:text-[64px] lg:text-[72px]" />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease }}
              className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft sm:text-[19px]"
            >
              {page.intro}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease }}>
              <DownloadButtons className="mt-9" />
            </motion.div>
          </div>

          <div className="relative mx-auto flex h-[420px] w-full max-w-[480px] items-start justify-center sm:h-[520px]">
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 0 }}
              animate={{ opacity: 1, x: 0, rotate: 7 }}
              transition={{ delay: 0.25, duration: 1, ease }}
              whileHover={{ rotate: 10, y: -10 }}
              className="absolute right-[4%] top-10 w-[44%] max-w-[220px]"
            >
              <Phone src={page.secondScreen} alt={`Fanitt for ${base.label.toLowerCase()}`} priority />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ delay: 0.1, duration: 1, ease }}
              whileHover={{ rotate: -6, y: -10, scale: 1.02 }}
              className="absolute left-[10%] top-0 z-10 w-[50%] max-w-[250px]"
            >
              <Phone src={base.screen} scroll={base.scroll} alt={`Fanitt for ${base.label.toLowerCase()}`} priority />
            </motion.div>
          </div>
        </div>
      </section>

      {/* main features */}
      <section className="py-16 lg:py-24">
        <div className="page">
          <RevealWords text={base.title} className="max-w-2xl text-[36px] font-extrabold leading-[1.02] sm:text-[50px]" />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
            {base.points.map((p, i) => (
              <StaggerItem key={p.title} className="h-full">
              <Spotlight
                tone={i === 0 ? 'flame' : 'light'}
                className={
                  i === 0
                    ? 'flame-bg h-full rounded-[28px] p-8 text-white sm:p-10'
                    : 'h-full rounded-[28px] bg-sand p-8 transition-colors duration-500 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(14,22,48,0.35)] sm:p-10'
                }
              >
                <h3 className={`text-[26px] font-extrabold leading-tight sm:text-[30px] ${i === 0 ? 'text-white' : ''}`}>{p.title}</h3>
                <p className={`mt-3 max-w-md text-[16px] leading-relaxed ${i === 0 ? 'text-white/85' : 'text-ink-soft'}`}>{p.text}</p>
              </Spotlight>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* how to start — a real sequence */}
      <section className="px-3 sm:px-5">
        <div className="grain relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-night py-20 text-white sm:rounded-[48px] lg:py-24">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-flame/30 blur-[110px]" />
          <div className="page relative">
            <RevealWords text="How to start" className="text-[36px] font-extrabold leading-[1.02] text-white sm:text-[50px]" />
            <Stagger as="ol" className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {page.steps.map((s, i) => (
                <StaggerItem as="li" key={s.title} className="group relative">
                  <div className="flex items-center gap-4">
                    <span className="flame-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-[20px] font-extrabold transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-8deg]">{i + 1}</span>
                    {i < page.steps.length - 1 && <span className="hidden h-px flex-1 bg-gradient-to-r from-white/30 to-transparent lg:block" />}
                  </div>
                  <h3 className="mt-5 font-sans text-[18px] font-bold tracking-[-0.01em] text-white">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] text-white/60">{s.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* more */}
      <section className="py-20 lg:py-24">
        <div className="page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <RevealWords text="And there is more." className="text-[36px] font-extrabold leading-[1.02] sm:text-[50px]" />
          <Stagger as="ul" className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {page.extras.map((e) => (
              <StaggerItem as="li" key={e.title} className="group flex gap-4 rounded-2xl p-3 transition-colors duration-300 hover:bg-sand">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-flame text-white transition-transform duration-500 group-hover:rotate-[360deg]">
                  <Check size={15} strokeWidth={3} />
                </span>
                <span>
                  <span className="block text-[17px] font-bold">{e.title}</span>
                  <span className="mt-1 block text-[15px] text-ink-soft">{e.text}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Cta title={page.cta} />
    </div>
  );
}