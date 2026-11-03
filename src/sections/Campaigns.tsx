// File: src/sections/Campaigns.tsx  (fanitt-website)
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { BadgeCheck, CheckCheck, Film, Lock, Megaphone, PartyPopper, ShieldCheck, UserRound, Users, Wallet, type LucideIcon } from 'lucide-react';
import { Reveal, RevealWords } from '@/components/motion';
import { cn } from '@/components/cn';
import { CAMPAIGN, CampaignScene, Coin } from './CampaignScenes';

const STEPS: { title: string; text: string; icon: LucideIcon; who: string }[] = [
  { title: 'Brand posts a campaign', text: 'Brief, pay per creator, city and how many creators are needed — live in a minute.', icon: Megaphone, who: 'Brand' },
  { title: 'Creators apply', text: 'Verified creators send proposals. The brand compares ratings and hires the best fit.', icon: Users, who: 'Creators' },
  { title: 'Brand pays into escrow', text: 'The money goes into Fanitt escrow — not to anyone yet. Nobody can touch it.', icon: Lock, who: 'Brand' },
  { title: 'Creator delivers', text: 'The reel, post or review is uploaded and sent to the brand for approval.', icon: Film, who: 'Creator' },
  { title: 'Payment is released', text: 'The brand approves, escrow opens and the money lands in the creator’s wallet.', icon: Wallet, who: 'Everyone' },
];

/* ---------- phone body ---------- */

const DESIGN_W = 270;

/** Scenes are drawn for a 270px-wide screen and scaled to the phone's size. */
function Scaled({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const [h, setH] = useState(560);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const scale = el.offsetWidth / DESIGN_W || 1;
      setK(scale);
      setH(el.offsetHeight / scale);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: DESIGN_W, height: h, transform: `scale(${k})` }}>
        {children}
      </div>
    </div>
  );
}

function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-[9/19.4] rounded-[13%/6%] bg-[#0b0d14] p-[3.2%] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_0_1.5px_rgba(255,255,255,0.14)]',
        className,
      )}
    >
      <span className="absolute -left-[1.6%] top-[18%] h-[7%] w-[1.6%] rounded-l bg-[#1a1d26]" />
      <span className="absolute -right-[1.6%] top-[24%] h-[13%] w-[1.6%] rounded-r bg-[#1a1d26]" />
      <div className="relative h-full w-full overflow-hidden rounded-[11%/5.2%] bg-[#F4F5F8]">
        <div className="absolute inset-x-0 top-0 z-20 flex h-[6.5%] items-center justify-between px-[7%] text-[9px] font-bold text-ink">
          <span>9:41</span>
          <span className="h-[46%] w-[30%] rounded-full bg-[#0b0d14]" />
          <span className="flex gap-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/70" />
            <span className="h-1.5 w-3 rounded-sm bg-ink/70" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-[6.5%]">
          <Scaled>{children}</Scaled>
        </div>
      </div>
    </div>
  );
}

/* ---------- things floating around the phone, per step ---------- */

function Float({ children, className, delay = 0 }: { children: ReactNode; className: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: -10 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18, delay }}
      className={cn('absolute z-20', className)}
    >
      <div className="animate-floaty">{children}</div>
    </motion.div>
  );
}

const glass = 'flex items-center gap-2 whitespace-nowrap rounded-2xl bg-white px-2.5 py-2 text-ink shadow-[0_24px_50px_-18px_rgba(0,0,0,0.75),0_0_0_1px_rgba(14,22,48,0.04)]';

function Props({ step }: { step: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div key={step} className="pointer-events-none absolute inset-0 hidden md:block">
        {step === 0 && (
          <>
            <Float className="left-[4%] top-[14%]" delay={0.3}>
              <div className={glass}>
                <span className="flame-bg flex h-9 w-9 items-center justify-center rounded-xl">
                  <Megaphone size={17} />
                </span>
                <span className="text-[12.5px] font-bold leading-tight">
                  {CAMPAIGN.title}
                  <span className="block text-[11px] font-medium text-ink-mute">{CAMPAIGN.pay} per creator</span>
                </span>
              </div>
            </Float>
            <Float className="right-[4%] bottom-[18%]" delay={1.6}>
              <div className={glass}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[12.5px] font-bold">Live for creators in {CAMPAIGN.city}</span>
              </div>
            </Float>
          </>
        )}
        {step === 1 && (
          <>
            {[0, 1, 2].map((i) => (
              <Float key={i} className={['left-[5%] top-[18%]', 'right-[5%] top-[42%]', 'left-[6%] bottom-[20%]'][i]} delay={0.4 + i * 0.4}>
                <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white py-1.5 pl-1.5 pr-3 text-ink shadow-[0_20px_40px_-18px_rgba(0,0,0,0.75)]">
                  <span className={cn('flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-white', ['from-[#FF6A1F] to-[#EC2A78]', 'from-[#8B5CF6] to-[#EC2A78]', 'from-[#0EA5E9] to-[#22C55E]'][i])}>
                    <UserRound size={15} />
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-bold">
                    Applied <BadgeCheck size={13} className="text-sky-500" />
                  </span>
                </div>
              </Float>
            ))}
          </>
        )}
        {step === 2 && (
          <>
            <Float className="left-[4%] top-[24%]" delay={0.3}>
              <div className={glass}>
                <Coin size={34} />
                <span className="text-[12.5px] font-bold leading-tight">
                  {CAMPAIGN.pay}
                  <span className="block text-[11px] font-medium text-ink-mute">paid by {CAMPAIGN.brand}</span>
                </span>
              </div>
            </Float>
            <Float className="right-[4%] bottom-[16%]" delay={2.8}>
              <div className={glass}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
                  <ShieldCheck size={18} />
                </span>
                <span className="text-[12.5px] font-bold leading-tight">
                  Locked in escrow
                  <span className="block text-[11px] font-medium text-ink-mute">Safe until work is approved</span>
                </span>
              </div>
            </Float>
          </>
        )}
        {step === 3 && (
          <>
            <Float className="right-[4%] top-[16%]" delay={0.4}>
              <div className={glass}>
                <span className="flame-bg flex h-9 w-9 items-center justify-center rounded-xl">
                  <Film size={17} />
                </span>
                <span className="text-[12.5px] font-bold">Reel uploaded</span>
              </div>
            </Float>
            <Float className="left-[4%] bottom-[22%]" delay={2.7}>
              <div className={glass}>
                <CheckCheck size={18} className="text-sky-500" />
                <span className="text-[12.5px] font-bold">Sent to {CAMPAIGN.brand}</span>
              </div>
            </Float>
          </>
        )}
        {step === 4 && (
          <>
            <Float className="left-[4%] top-[20%]" delay={0.9}>
              <div className={glass}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white"><CheckCheck size={16} /></span>
                <span className="text-[12.5px] font-bold">Work approved</span>
              </div>
            </Float>
            <Float className="right-[4%] bottom-[18%]" delay={2.5}>
              <div className={glass}>
                <PartyPopper size={20} className="text-[#FFB020]" />
                <span className="text-[12.5px] font-bold leading-tight">
                  {CAMPAIGN.pay} received
                  <span className="block text-[11px] font-medium text-ink-mute">in the creator’s wallet</span>
                </span>
              </div>
            </Float>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/** Dark stage with the phone, glow and floating props. */
function Stage({ step, className, phoneClass }: { step: number; className?: string; phoneClass?: string }) {
  return (
    <div className={cn('grain relative overflow-hidden rounded-[36px] bg-night', className)}>
      {/* moving colour light */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(60% 50% at 30% 30%, rgba(255,90,31,0.55), transparent 70%)',
            'radial-gradient(60% 50% at 70% 40%, rgba(236,42,120,0.5), transparent 70%)',
            'radial-gradient(60% 50% at 40% 70%, rgba(255,176,32,0.4), transparent 70%)',
            'radial-gradient(60% 50% at 30% 30%, rgba(255,90,31,0.55), transparent 70%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      />
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      {/* turning ring behind the phone */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(255,90,31,0.9), rgba(255,176,32,0.6), rgba(236,42,120,0.9), transparent 70%, rgba(255,90,31,0.9))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
          }}
        />
      </div>

      <div className="relative flex h-full items-center justify-center">
        <div className={cn('relative', phoneClass)}>
          <Shell className="h-full w-auto">
            <AnimatePresence mode="wait">
              <CampaignScene key={step} step={step} />
            </AnimatePresence>
          </Shell>
        </div>
      </div>
      <Props step={step} />

      {/* step label */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur">
          {STEPS.map((_, i) => (
            <span key={i} className={cn('h-1.5 rounded-full transition-all duration-500', i === step ? 'w-7 bg-flame' : i < step ? 'w-1.5 bg-flame/60' : 'w-1.5 bg-white/25')} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- the section ---------- */

const STEP_MS = 4600;

export function Campaigns() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [runKey, setRunKey] = useState(0);

  // Plays through the five steps on its own while the section is on screen.
  // Pointing at the stage pauses it; picking a step jumps there.
  useEffect(() => {
    if (!inView || paused) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [inView, paused, step, runKey]);

  const pick = (i: number) => {
    setStep(i);
    setRunKey((k) => k + 1);
  };

  return (
    <section ref={ref} id="how-it-works" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-flame/10 blur-[130px]" />
      <div className="page relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0">
        {/* words */}
        <div className="lg:col-start-1 lg:row-start-1">
          <RevealWords text="Brand deals, without the chasing." className="text-[38px] font-extrabold leading-[1.02] sm:text-[52px]" />
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink-soft">
              One campaign, from post to payout. The money stays locked in escrow until the brand approves the work.
            </p>
          </Reveal>
        </div>

        {/* steps — under the phone on small screens, beside it on large ones */}
        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
          <Reveal delay={0.2}>
            <ol className="space-y-1.5 lg:mt-8">
              {STEPS.map((s, i) => {
                const on = i === step;
                const done = i < step;
                const Icon = s.icon;
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-current={on ? 'step' : undefined}
                      className={cn(
                        'group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition-colors duration-300',
                        on ? 'bg-white shadow-[0_18px_40px_-26px_rgba(14,22,48,0.45)] ring-1 ring-ink/[0.05]' : 'hover:bg-white/60',
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                            on ? 'flame-bg text-white' : done ? 'bg-flame-soft text-flame' : 'bg-sand text-ink-mute group-hover:text-flame',
                          )}
                        >
                          <Icon size={17} />
                        </span>
                        <span className={cn('flex-1 text-[16px] font-bold transition-colors', on ? 'text-ink' : 'text-ink-soft')}>{s.title}</span>
                        <span className={cn('text-[12px] font-bold', on ? 'text-flame' : 'text-ink-mute/60')}>{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pl-[50px] pt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{s.text}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* time left on this step */}
                      {on && (
                        <span className="absolute inset-x-4 bottom-0 h-[2px] overflow-hidden rounded-full bg-ink/[0.05]">
                          <motion.span
                            key={`${step}-${runKey}-${paused}`}
                            initial={{ width: '0%' }}
                            animate={{ width: inView && !paused ? '100%' : '0%' }}
                            transition={{ duration: inView && !paused ? STEP_MS / 1000 : 0, ease: 'linear' }}
                            className="flame-bg block h-full"
                          />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>

        {/* the phone on its stage */}
        <Reveal from="blur" className="order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)} onPointerLeave={() => setPaused(false)}>
            <Stage step={inView ? step : 0} className="h-[520px] sm:h-[620px] lg:h-[640px]" phoneClass="h-[440px] sm:h-[530px] lg:h-[550px]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}