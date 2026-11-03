// File: src/sections/Store.tsx  (fanitt-website)
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Check, Copy, Eye, Gift, Heart, IndianRupee, Link2, Mic, MousePointer2, Package, PhoneOff, Radio, ShoppingBag, UserRound, Video, Wallet } from 'lucide-react';
import { Reveal, RevealWords, Spotlight } from '@/components/motion';
import { cn } from '@/components/cn';

/* ---------- helpers ---------- */

/** Restarts its children every [ms] while on screen, so each card's little story loops. */
function Loop({ ms, children }: { ms: number; children: (run: number) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = window.setInterval(() => setRun((r) => r + 1), ms);
    return () => window.clearInterval(t);
  }, [inView, ms]);
  return (
    <div ref={ref} className="relative h-full w-full">
      {inView ? <div key={run} className="h-full w-full">{children(run)}</div> : null}
    </div>
  );
}

function Coin({ size = 28 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE9A8,#FFB020_55%,#E8890A)] text-[#7A4A00] shadow-[0_8px_18px_-6px_rgba(232,137,10,0.9),inset_0_-2px_0_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.6)]"
      style={{ width: size, height: size }}
    >
      <IndianRupee size={size * 0.48} strokeWidth={2.8} />
    </span>
  );
}

function Timer({ start = 0 }: { start?: number }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    let tick: number | undefined;
    const begin = window.setTimeout(() => {
      setS(1);
      tick = window.setInterval(() => setS((v) => v + 1), 1000);
    }, start);
    return () => {
      window.clearTimeout(begin);
      if (tick) window.clearInterval(tick);
    };
  }, [start]);
  return <>{`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`}</>;
}

/** Card: icon + title, the moving picture, one line under it. */
function Tile({ icon: Icon, title, text, children }: { icon: typeof Video; title: string; text: string; children: ReactNode }) {
  return (
    <Spotlight tone="dark" tilt={4} className="flex h-full flex-col rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-3 transition-colors duration-500 hover:border-flame/40">
      <div className="relative h-[176px] shrink-0 overflow-hidden rounded-[18px] bg-black/25 ring-1 ring-white/[0.06]">{children}</div>
      <div className="flex items-center gap-2 px-1.5 pt-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-flame ring-1 ring-white/10 transition-all duration-500 group-hover/spot:rotate-[-8deg] group-hover/spot:bg-flame group-hover/spot:text-white">
          <Icon size={15} />
        </span>
        <h3 className="text-[16px] font-bold tracking-[-0.02em] text-white">{title}</h3>
      </div>
      <p className="px-1.5 pb-1 pt-1.5 text-[13px] leading-snug text-white/55">{text}</p>
    </Spotlight>
  );
}

const springy = { type: 'spring', stiffness: 300, damping: 20 } as const;

/* ---------- 1. paid calls ---------- */

function CallVisual() {
  return (
    <Loop ms={11000}>
      {() => (
        <div className="relative h-full overflow-hidden bg-[linear-gradient(140deg,#FF8A3D,#EC2A78_60%,#5B21B6)]">
          <span className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/25 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/25 backdrop-blur">
              <UserRound size={30} className="text-white" />
            </span>
          </div>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.9], opacity: [0.6, 0] }}
              transition={{ duration: 1.4, delay: i * 0.45, repeat: 1 }}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70"
            />
          ))}
          {/* fan in the corner */}
          <span className="absolute right-2.5 top-2.5 flex h-12 w-10 items-center justify-center rounded-lg bg-[#0E1630]/80 ring-1 ring-white/20">
            <UserRound size={16} className="text-white/80" />
          </span>
          <div className="absolute left-2.5 top-2.5">
            <motion.span initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 2.6, duration: 0.2 }} className="absolute whitespace-nowrap rounded-full bg-black/35 px-2 py-0.5 text-[10.5px] font-bold text-white backdrop-blur">
              Ringing…
            </motion.span>
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8, ...springy }} className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/35 px-2 py-0.5 text-[10.5px] font-bold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <Timer start={2800} />
            </motion.span>
          </div>
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between">
            <span className="flex gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"><Mic size={12} /></span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose text-white"><PhoneOff size={12} /></span>
            </span>
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, ...springy }} className="flex items-center gap-0.5 rounded-full bg-white px-2 py-1 text-[10.5px] font-extrabold text-ink">
              <IndianRupee size={10} strokeWidth={3} /> per min
            </motion.span>
          </div>
        </div>
      )}
    </Loop>
  );
}

/* ---------- 2. live sessions ---------- */

function LiveVisual() {
  const hearts = Array.from({ length: 9 }, (_, i) => i);
  return (
    <Loop ms={8000}>
      {() => (
        <div className="relative h-full overflow-hidden bg-[linear-gradient(160deg,#5B21B6,#EC2A78_55%,#FF8A3D)]">
          <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/25 backdrop-blur">
              <UserRound size={36} className="text-white" />
            </span>
          </div>
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="rounded-md bg-rose px-2 py-0.5 text-[11px] font-extrabold text-white">
              LIVE
            </motion.span>
            <span className="flex items-center gap-1 rounded-md bg-black/35 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
              <Eye size={11} /> watching
            </span>
          </div>
          {/* fans joining */}
          <div className="absolute bottom-3 left-3 flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.7, ...springy }}
                className={cn('flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-[#EC2A78] bg-gradient-to-br', ['from-[#FFB020] to-[#FF5A1F]', 'from-[#0EA5E9] to-[#22C55E]', 'from-[#8B5CF6] to-[#EC2A78]', 'from-white to-white/70'][i])}
              >
                <UserRound size={14} className={i === 3 ? 'text-ink' : 'text-white'} />
              </motion.span>
            ))}
          </div>
          {/* hearts */}
          {hearts.map((i) => (
            <motion.span
              key={i}
              initial={{ y: 0, opacity: 0, scale: 0.4 }}
              animate={{ y: -180, opacity: [0, 1, 0], scale: [0.4, 1, 0.8], x: [0, i % 2 ? 12 : -12, 0] }}
              transition={{ delay: 0.4 + i * 0.65, duration: 2.6, ease: 'easeOut' }}
              className="absolute bottom-6 right-5"
            >
              <Heart size={20 + (i % 3) * 4} fill={i % 3 === 0 ? '#ffffff' : '#FF3D6E'} className={i % 3 === 0 ? 'text-white' : 'text-[#FF3D6E]'} />
            </motion.span>
          ))}
        </div>
      )}
    </Loop>
  );
}

/* ---------- 3. digital products ---------- */

function ProductVisual() {
  return (
    <Loop ms={7000}>
      {() => (
        <div className="flex h-full items-center justify-center p-4 [perspective:900px]">
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: [0, 0, 180, 180] }}
            transition={{ duration: 3.4, times: [0, 0.55, 0.75, 1], delay: 0.4 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative h-[140px] w-[112px]"
          >
            {/* front: the product */}
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl [backface-visibility:hidden]">
              <div className="relative flex flex-1 items-center justify-center bg-[linear-gradient(140deg,#FFB020,#FF5A1F_60%,#EC2A78)]">
                <BookOpen size={34} className="text-white" />
                <span className="absolute left-2 top-2 rounded-full bg-black/25 px-2 py-0.5 text-[9.5px] font-bold text-white">E-book</span>
              </div>
              <div className="p-2.5">
                <div className="h-2 w-20 rounded-full bg-ink/70" />
                <motion.div animate={{ scale: [1, 1, 0.9, 1] }} transition={{ duration: 1.9, times: [0, 0.8, 0.9, 1], delay: 0.2 }} className="flame-bg mt-2 flex h-7 items-center justify-center gap-1 rounded-lg text-[10.5px] font-bold text-white">
                  <ShoppingBag size={11} /> Buy
                </motion.div>
              </div>
            </div>
            {/* back: in the library */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white text-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={24} strokeWidth={3} />
              </span>
              <p className="px-2 text-[12px] font-bold text-ink">In your library</p>
              <p className="px-3 text-[10px] text-ink-mute">Open it any time</p>
            </div>
          </motion.div>
          <motion.span initial={{ opacity: 0, y: 10, scale: 0.6 }} animate={{ opacity: [0, 1, 1, 0], y: [10, -20, -60, -90] }} transition={{ delay: 2.6, duration: 1.6 }} className="absolute right-6 top-1/2">
            <Coin />
          </motion.span>
        </div>
      )}
    </Loop>
  );
}

/* ---------- 4. FanBox ---------- */

function FanBoxVisual() {
  const coins = Array.from({ length: 7 }, (_, i) => i);
  return (
    <Loop ms={6500}>
      {() => (
        <div className="relative flex h-full items-end justify-center pb-6">
          {coins.map((i) => (
            <motion.span
              key={i}
              initial={{ y: 0, x: 0, opacity: 0, scale: 0.4 }}
              animate={{ y: [-10, -100 - (i % 3) * 22], x: (i - 3) * 22, opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.8], rotate: (i - 3) * 20 }}
              transition={{ delay: 1.3 + i * 0.06, duration: 1.6, ease: 'easeOut' }}
              className="absolute bottom-[86px]"
            >
              <Coin size={26} />
            </motion.span>
          ))}
          <div className="relative">
            {/* lid */}
            <motion.div
              initial={{ y: 0, rotate: 0 }}
              animate={{ y: [0, 0, -34, -30], rotate: [0, 0, -16, -12], x: [0, 0, -8, -6] }}
              transition={{ duration: 1.6, times: [0, 0.7, 0.85, 1], delay: 0 }}
              className="absolute -top-5 left-1/2 z-10 h-6 w-[108px] -translate-x-1/2 rounded-lg bg-[linear-gradient(90deg,#FF5A1F,#EC2A78)] shadow-lg"
            >
              <span className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-[#FFB020]" />
            </motion.div>
            {/* box */}
            <motion.div animate={{ rotate: [0, -4, 4, -3, 3, 0, 0] }} transition={{ duration: 1, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1], delay: 0.1 }} className="relative h-[72px] w-[96px] overflow-hidden rounded-b-xl rounded-t-md bg-[linear-gradient(160deg,#FF7A2F,#E0336A)] shadow-[0_20px_40px_-16px_rgba(255,90,31,0.8)]">
              <span className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-[#FFB020]" />
            </motion.div>
          </div>
          <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="absolute inset-x-0 top-3 mx-auto w-max rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-ink">
            A fan sent support
          </motion.span>
        </div>
      )}
    </Loop>
  );
}

/* ---------- 5. affiliate ---------- */

function AffiliateVisual() {
  return (
    <Loop ms={7500}>
      {() => (
        <div className="relative flex h-full flex-col justify-center gap-2 p-3">
          <div className="flex items-center gap-2 rounded-xl bg-white p-2 pl-3 text-ink">
            <Link2 size={14} className="shrink-0 text-flame" />
            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-ink-soft">Your link</span>
            <span className="relative flex h-7 min-w-[74px] items-center justify-center overflow-hidden rounded-lg bg-ink text-[10.5px] font-bold text-white">
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.1 }} className="absolute flex items-center gap-1">
                <Copy size={11} /> Copy
              </motion.span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }} className="flex items-center gap-1 text-emerald-300">
                <Check size={11} strokeWidth={3} /> Copied
              </motion.span>
            </span>
          </div>
          {/* the pointer that taps copy */}
          <motion.span
            initial={{ x: -40, y: 60, opacity: 0 }}
            animate={{ x: [-40, 60, 60], y: [60, -30, -30], opacity: [0, 1, 0], scale: [1, 1, 0.85] }}
            transition={{ duration: 1.6, times: [0, 0.6, 1] }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 text-white drop-shadow"
          >
            <MousePointer2 size={20} fill="#fff" />
          </motion.span>
          {/* sales come in */}
          <div className="flex flex-col gap-1.5">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 + i * 1.1, ...springy }}
                className="flex items-center gap-2 rounded-xl bg-white/[0.07] p-2 ring-1 ring-white/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                  <ShoppingBag size={13} />
                </span>
                <span className="flex-1 whitespace-nowrap text-[11px] font-bold text-white">New sale</span>
                <Coin size={22} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Loop>
  );
}

/* ---------- wallet strip ---------- */

const SOURCES = [
  { icon: Video, label: 'Calls' },
  { icon: Radio, label: 'Live' },
  { icon: Package, label: 'Products' },
  { icon: Gift, label: 'FanBox' },
  { icon: Link2, label: 'Affiliate' },
];

function WalletStrip() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-3">
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex flex-1 flex-wrap gap-2">
          {SOURCES.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[12.5px] font-bold text-white/80 ring-1 ring-white/10">
              <Icon size={13} className="text-flame" /> {label}
            </span>
          ))}
        </div>
        {/* coins flowing to the wallet */}
        <div className="relative hidden h-10 w-40 md:block">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-white/20" />
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [0, 136], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            >
              <Coin size={22} />
            </motion.span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2.5 rounded-2xl bg-white px-3 py-2 text-ink">
          <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.8 }} className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
            <Wallet size={17} />
          </motion.span>
          <span className="leading-tight">
            <span className="block text-[13px] font-bold">Your Fanitt wallet</span>
            <span className="block text-[11.5px] text-ink-mute">Withdraw to your bank</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- section ---------- */

export function Store() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardScale = useTransform(scrollYProgress, [0, 0.25], [0.94, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.25], [64, 40]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  const tiles = [
    { icon: Video, title: 'Paid calls', text: 'Audio and video calls at your own per-minute rate.', v: <CallVisual /> },
    { icon: Radio, title: 'Live sessions', text: 'Go live for followers or a community, free or paid.', v: <LiveVisual /> },
    { icon: Package, title: 'Digital products', text: 'E-books, presets and courses, kept in buyers’ library.', v: <ProductVisual /> },
    { icon: Gift, title: 'FanBox', text: 'Fans send support and gifts straight to you.', v: <FanBoxVisual /> },
    { icon: Link2, title: 'Affiliate links', text: 'Share products you love and earn on every sale.', v: <AffiliateVisual /> },
  ];

  return (
    <section className="px-3 sm:px-5">
      <motion.div ref={ref} style={{ scale: cardScale, borderRadius: radius }} className="grain relative mx-auto max-w-[1400px] overflow-hidden bg-night py-14 text-white lg:py-16">
        <motion.div style={{ opacity: glow }} className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,90,31,0.45),rgba(236,42,120,0.25)_55%,transparent)] blur-[60px]" />

        <div className="page relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <RevealWords text="Your own store, inside Fanitt." className="text-[34px] font-extrabold leading-[1.02] text-white sm:text-[46px]" />
              <Reveal delay={0.2}>
                <p className="mt-3 text-[16px] text-white/60">Five ways to earn from the people who follow you — all paid into one wallet.</p>
              </Reveal>
            </div>
          </div>

          <Reveal from="blur" className="mt-7">
            <WalletStrip />
          </Reveal>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {tiles.map((t, i) => (
              <Reveal key={t.title} from="up" delay={i * 0.06} className={i === 4 ? 'sm:col-span-2 lg:col-span-1' : undefined}>
                <Tile icon={t.icon} title={t.title} text={t.text}>
                  {t.v}
                </Tile>
              </Reveal>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}