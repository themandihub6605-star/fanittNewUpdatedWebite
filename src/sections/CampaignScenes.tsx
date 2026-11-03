// File: src/sections/CampaignScenes.tsx  (fanitt-website)
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { BadgeCheck, Bell, Check, ChevronLeft, Film, IndianRupee, Lock, LockOpen, MapPin, Play, Scissors, ShieldCheck, Sparkles, Star, UserRound, Users, Wallet } from 'lucide-react';

/**
 * The app scenes that play inside the phone, one per campaign step.
 * Built from a real campaign in the app (Style salon — Hair and makeup).
 */

export const CAMPAIGN = {
  brand: 'Style salon',
  title: 'Hair and makeup',
  pay: '₹1,000',
  payValue: 1000,
  city: 'Bhopal',
  spots: 10,
};

/** The brand's round mark — drawn, so it stays sharp at any size. */
export function BrandMark({ size = 20 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-ink font-display font-extrabold text-white ring-2 ring-white"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      S
    </span>
  );
}

/** Campaign cover art — drawn, so it stays sharp at any size. */
export function Cover({ className = '', icon = 'scissors' }: { className?: string; icon?: 'scissors' | 'film' | 'none' }) {
  const Icon = icon === 'film' ? Film : icon === 'none' ? null : Scissors;
  return (
    <span className={`relative flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#FF8A3D_0%,#FF3D6E_55%,#B4237A_100%)] text-white ${className}`}>
      <span className="absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-white/25 blur-xl" />
      <span className="absolute -bottom-1/3 -right-1/4 h-3/4 w-3/4 rounded-full bg-[#FFB020]/40 blur-xl" />
      <Sparkles className="absolute right-[14%] top-[14%] h-[18%] w-[18%] text-white/80" />
      {Icon && <Icon className="relative h-[38%] w-[38%]" strokeWidth={2} />}
    </span>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: 'spring', stiffness: 320, damping: 22 } as const;

/* ---------- small building blocks ---------- */

function AppBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-3">
      <span className="flex items-center gap-1.5">
        <ChevronLeft size={16} className="text-ink" />
        <span className="font-display text-[16px] font-extrabold tracking-[-0.02em] text-ink">{title}</span>
      </span>
      {right ?? (
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
          <Bell size={13} className="text-ink" />
        </span>
      )}
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[18px] border border-black/[0.04] bg-white p-3 shadow-[0_10px_26px_-18px_rgba(14,22,48,0.45)] ${className}`}>{children}</div>;
}

function BrandLine({ small }: { small?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <BrandMark size={small ? 16 : 20} />
      <span className={`${small ? 'text-[10px]' : 'text-[11px]'} font-semibold text-ink-mute`}>{CAMPAIGN.brand}</span>
    </span>
  );
}

function CampaignCard({ children }: { children?: ReactNode }) {
  return (
    <Card>
      <div className="flex gap-2.5">
        <Cover className="h-[66px] w-[66px] shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <BrandLine />
          <p className="mt-1 text-[14px] font-bold leading-tight text-ink">{CAMPAIGN.title}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700">
              <IndianRupee size={9} /> 1,000 / creator
            </span>
            <span className="flex items-center gap-0.5 rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[9.5px] font-semibold text-ink-soft">
              <MapPin size={9} /> {CAMPAIGN.city}
            </span>
          </div>
        </div>
      </div>
      {children}
    </Card>
  );
}

function Avatar({ i, size = 32 }: { i: number; size?: number }) {
  const g = ['from-[#FF6A1F] to-[#EC2A78]', 'from-[#8B5CF6] to-[#EC2A78]', 'from-[#0EA5E9] to-[#22C55E]', 'from-[#FFB020] to-[#FF5A1F]'][i % 4];
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${g} text-white ring-2 ring-white`} style={{ width: size, height: size }}>
      <UserRound size={size * 0.5} />
    </span>
  );
}

export function Coin({ size = 40 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE9A8,#FFB020_55%,#E8890A)] text-[#7A4A00] shadow-[0_10px_22px_-6px_rgba(232,137,10,0.85),inset_0_-3px_0_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.6)]"
      style={{ width: size, height: size }}
    >
      <IndianRupee size={size * 0.46} strokeWidth={2.8} />
    </span>
  );
}

/** A small 3D safe. */
function Vault({ locked, size = 1 }: { locked: boolean; size?: number }) {
  return (
    <div className="relative flex flex-col items-center" style={{ transform: `scale(${size})` }}>
      <motion.div
        animate={{
          boxShadow: locked
            ? '0 0 0 7px rgba(34,197,94,0.18), 0 0 40px rgba(34,197,94,0.45), 0 22px 36px -18px rgba(14,22,48,0.7)'
            : '0 0 0 0 rgba(34,197,94,0), 0 0 0 rgba(0,0,0,0), 0 22px 36px -18px rgba(14,22,48,0.7)',
        }}
        transition={{ duration: 0.5 }}
        className="relative h-[86px] w-[104px] rounded-[20px] bg-gradient-to-b from-[#26305C] via-[#151B38] to-[#0A0F24] ring-1 ring-white/10"
      >
        <span className="absolute inset-[7px] rounded-[14px] border border-white/10" />
        <motion.span animate={{ rotate: locked ? 270 : 0 }} transition={{ duration: 0.9, ease }} className="absolute left-[14px] top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border-[3px] border-white/20 bg-white/5">
          <span className="absolute left-1/2 top-0.5 h-2.5 w-[3px] -translate-x-1/2 rounded bg-[#FFB020]" />
        </motion.span>
        <motion.span
          key={locked ? 'l' : 'u'}
          initial={{ scale: 0.3, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 13 }}
          className={`absolute right-[12px] top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-white ${locked ? 'bg-emerald-500' : 'flame-bg'}`}
        >
          {locked ? <Lock size={19} /> : <LockOpen size={19} />}
        </motion.span>
      </motion.div>
    </div>
  );
}

function VaultSwitch({ from, delay, size }: { from: 'open' | 'locked'; delay: number; size?: number }) {
  const [locked, setLocked] = useState(from === 'locked');
  useEffect(() => {
    const t = window.setTimeout(() => setLocked(from !== 'locked'), delay * 1000);
    return () => window.clearTimeout(t);
  }, [from, delay]);
  return <Vault locked={locked} size={size} />;
}

function Typing({ text, delay = 0, speed = 0.05 }: { text: string; delay?: number; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    let t: number;
    const start = window.setTimeout(() => {
      t = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) window.clearInterval(t);
      }, speed * 1000);
    }, delay * 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(t);
    };
  }, [text, delay, speed]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="ml-px inline-block h-[1em] w-[1.5px] translate-y-[2px] animate-pulse bg-flame" />}
    </>
  );
}

function CountUp({ to, delay = 0, duration = 1, prefix = '' }: { to: number; delay?: number; duration?: number; prefix?: string }) {
  const v = useMotionValue(0);
  const text = useTransform(v, (x) => `${prefix}${Math.round(x).toLocaleString('en-IN')}`);
  useEffect(() => {
    const c = animate(v, to, { delay, duration, ease: 'easeOut' });
    return () => c.stop();
  }, [to, delay, duration, v]);
  return <motion.span>{text}</motion.span>;
}

function Pressed({ children, at, className = '' }: { children: ReactNode; at: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: [1, 1, 0.93, 1] }}
      transition={{ opacity: { delay: at - 0.6 }, y: { delay: at - 0.6 }, scale: { delay: at, duration: 0.35, times: [0, 0.01, 0.5, 1] } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A finger tap ring at the button. */
function Tap({ at }: { at: number }) {
  return (
    <motion.span
      aria-hidden
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale: [0.2, 1.6], opacity: [0, 0.6, 0] }}
      transition={{ delay: at, duration: 0.6 }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
    />
  );
}

function Confetti({ delay }: { delay: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        i,
        x: (Math.random() - 0.5) * 280,
        y: -(90 + Math.random() * 220),
        r: Math.random() * 720 - 360,
        c: ['#FF5A1F', '#EC2A78', '#FFB020', '#22C55E', '#0EA5E9', '#8B5CF6'][i % 6],
        w: 5 + Math.random() * 5,
        d: 1 + Math.random() * 0.8,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[46%] z-30 flex justify-center">
      {bits.map((b) => (
        <motion.span
          key={b.i}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 220], opacity: [0, 1, 1, 0], rotate: b.r }}
          transition={{ delay, duration: b.d + 1, ease: 'easeOut', times: [0, 0.35, 0.8, 1] }}
          className="absolute rounded-[2px]"
          style={{ width: b.w, height: b.w * 1.7, background: b.c }}
        />
      ))}
    </div>
  );
}

/* ---------- the five scenes ---------- */

function PostScene() {
  return (
    <div className="flex h-full flex-col">
      <AppBar title="New campaign" />
      <div className="flex flex-1 flex-col gap-2.5 px-3.5">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease }}>
          <Card>
            <p className="text-[9.5px] font-bold text-ink-mute">Campaign title</p>
            <p className="mt-1 min-h-[18px] text-[14px] font-bold text-ink">
              <Typing text={CAMPAIGN.title} delay={0.4} />
            </p>
            <div className="mt-2.5 overflow-hidden rounded-xl">
              <motion.div initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.8, ease }}>
                <Cover className="h-[92px] w-full" />
              </motion.div>
            </div>
          </Card>
        </motion.div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { k: 'Pay', v: '₹1,000', c: 'text-emerald-600' },
            { k: 'City', v: CAMPAIGN.city, c: 'text-ink' },
            { k: 'Creators', v: String(CAMPAIGN.spots), c: 'text-ink' },
          ].map((f, i) => (
            <motion.div key={f.k} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: 1.6 + i * 0.12 }}>
              <Card className="!rounded-[14px] !p-2 text-center">
                <p className="text-[8.5px] font-semibold text-ink-mute">{f.k}</p>
                <p className={`mt-0.5 text-[12px] font-extrabold ${f.c}`}>{f.v}</p>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-auto pb-4">
          <Pressed at={2.6} className="relative">
            <motion.div
              initial={{ background: 'linear-gradient(120deg,#FF6A1F,#EC2A78)' }}
              animate={{ background: ['linear-gradient(120deg,#FF6A1F,#EC2A78)', 'linear-gradient(120deg,#FF6A1F,#EC2A78)', 'linear-gradient(120deg,#16A34A,#22C55E)'] }}
              transition={{ delay: 2.7, duration: 0.4, times: [0, 0.01, 1] }}
              className="relative flex h-11 items-center justify-center overflow-hidden rounded-2xl text-[13px] font-bold text-white shadow-[0_12px_24px_-12px_rgba(255,90,31,0.9)]"
            >
              <Tap at={2.6} />
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 2.75 }} className="absolute">
                Publish campaign
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.85 }} className="flex items-center gap-1.5">
                <Check size={15} strokeWidth={3} /> Campaign is live
              </motion.span>
            </motion.div>
          </Pressed>
        </div>
      </div>
    </div>
  );
}

const CREATORS = ['Beauty creator', 'Fashion creator', 'Lifestyle creator'];

function ApplyScene() {
  return (
    <div className="flex h-full flex-col">
      <AppBar title="Proposals" />
      <div className="flex flex-1 flex-col gap-2 px-3.5">
        <CampaignCard>
          <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-black/10 pt-2 text-[10px]">
            <span className="flex items-center gap-1 font-semibold text-ink-soft">
              <Users size={11} />
              <CountUp to={3} delay={0.6} duration={1.6} /> applied
            </span>
            <span className="font-bold text-flame">Review</span>
          </div>
        </CampaignCard>
        {CREATORS.map((c, i) => (
          <motion.div
            key={c}
            initial={{ x: i % 2 ? 90 : -90, opacity: 0, rotate: i % 2 ? 8 : -8 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ ...spring, delay: 0.5 + i * 0.45 }}
          >
            <Card className="flex items-center gap-2.5 !p-2.5">
              <Avatar i={i} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-[11.5px] font-bold text-ink">
                  {c} <BadgeCheck size={12} className="text-sky-500" />
                </p>
                <span className="mt-0.5 flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={9} className="text-[#FFB020]" fill="#FFB020" />
                  ))}
                </span>
              </div>
              {i === 0 ? (
                <motion.span
                  initial={{ backgroundColor: '#FFE6DA', color: '#E8430A' }}
                  animate={{ backgroundColor: '#22C55E', color: '#ffffff' }}
                  transition={{ delay: 2.4, duration: 0.3 }}
                  className="relative flex h-7 items-center gap-1 overflow-hidden rounded-full px-2.5 text-[10px] font-bold"
                >
                  <motion.span initial={{ opacity: 1 }} animate={{ opacity: 0, width: 0 }} transition={{ delay: 2.4 }}>
                    Accept
                  </motion.span>
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} transition={{ delay: 2.45 }} className="flex items-center gap-0.5">
                    <Check size={11} strokeWidth={3} /> Hired
                  </motion.span>
                </motion.span>
              ) : (
                <span className="flex h-7 items-center rounded-full bg-flame-soft px-2.5 text-[10px] font-bold text-flame-deep">Accept</span>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PayScene() {
  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Pay creator" />
      <div className="flex flex-1 flex-col items-center gap-3 px-3.5">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease }} className="w-full">
          <Card className="text-center">
            <BrandLine small />
            <p className="mt-2 text-[10px] font-semibold text-ink-mute">Amount for 1 creator</p>
            <p className="mt-0.5 font-display text-[30px] font-extrabold tracking-[-0.03em] text-ink">
              <CountUp to={CAMPAIGN.payValue} prefix="₹" delay={0.3} duration={0.9} />
            </p>
            <Pressed at={1.4} className="relative mt-2">
              <div className="flame-bg relative flex h-10 items-center justify-center gap-1.5 overflow-hidden rounded-xl text-[12px] font-bold text-white">
                <Tap at={1.4} />
                <ShieldCheck size={14} /> Pay into escrow
              </div>
            </Pressed>
          </Card>
        </motion.div>

        {/* coin falls into the safe */}
        <div className="relative flex w-full flex-1 flex-col items-center justify-center pb-6 pt-16">
          <motion.div
            className="absolute top-0 z-20"
            initial={{ y: -10, opacity: 0, scale: 0.4, rotateY: 0 }}
            animate={{ y: [-10, -10, 120], opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 0.5], rotateY: [0, 0, 720] }}
            transition={{ delay: 1.6, duration: 1.2, times: [0, 0.2, 0.85, 1], ease: 'easeIn' }}
          >
            <Coin />
          </motion.div>
          <VaultSwitch from="open" delay={2.7} />
          <motion.p
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 2.9 }}
            className="mt-3 flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700"
          >
            <Lock size={11} /> ₹1,000 held in escrow
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function DeliverScene() {
  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Submit work" />
      {/* the brand gets a notification */}
      <motion.div
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 2.7 }}
        className="absolute inset-x-3 top-2 z-20 flex items-center gap-2 rounded-2xl bg-ink/95 p-2.5 text-white shadow-xl backdrop-blur"
      >
        <BrandMark size={28} />
        <span className="min-w-0">
          <span className="block text-[10.5px] font-bold">New work to review</span>
          <span className="block text-[9.5px] text-white/60">{CAMPAIGN.title} — reel</span>
        </span>
      </motion.div>
      <div className="flex flex-1 flex-col gap-2.5 px-3.5 pb-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative flex-1 overflow-hidden rounded-[20px] bg-ink"
        >
          <Cover icon="none" className="absolute inset-0 h-full w-full" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          {/* sound bars */}
          <span className="absolute bottom-10 left-3 flex h-6 items-end gap-[3px]">
            {[0, 1, 2, 3, 4].map((b) => (
              <motion.span key={b} animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }} transition={{ duration: 1.1, repeat: Infinity, delay: b * 0.12 }} className="w-[3px] rounded-full bg-white/85" />
            ))}
          </span>
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[9.5px] font-bold text-white backdrop-blur">
            <Film size={10} /> Reel
          </span>
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-flame shadow-lg"
          >
            <Play size={20} fill="currentColor" />
          </motion.span>
          <span className="absolute inset-x-2.5 bottom-2.5">
            <BrandLine small />
          </span>
        </motion.div>
        <Card className="!p-2.5">
          <div className="flex items-center justify-between text-[10.5px] font-bold">
            <span className="text-ink">Uploading reel</span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} className="flex items-center gap-1 text-emerald-600">
              <Check size={11} strokeWidth={3} /> Sent
            </motion.span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.07]">
            <motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ delay: 0.6, duration: 1.6, ease: 'easeInOut' }} className="flame-bg block h-full rounded-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ReleaseScene() {
  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Review work" />
      <div className="flex flex-1 flex-col items-center gap-2.5 px-3.5 pb-4">
        <Card className="flex w-full items-center gap-2.5 !p-2.5">
          <Cover icon="film" className="h-11 w-11 shrink-0 rounded-xl" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11.5px] font-bold text-ink">{CAMPAIGN.title} — reel</span>
            <span className="mt-0.5 flex items-center gap-1 text-[9.5px] font-semibold text-ink-mute">
              <Avatar i={0} size={14} /> Beauty creator
            </span>
          </span>
        </Card>
        <Pressed at={0.9} className="relative w-full">
          <div className="relative flex h-10 items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-emerald-500 text-[12px] font-bold text-white shadow-[0_10px_20px_-10px_rgba(34,197,94,0.9)]">
            <Tap at={0.9} />
            <Check size={14} strokeWidth={3} /> Approve work
          </div>
        </Pressed>

        <div className="relative flex w-full flex-1 flex-col items-center justify-between pt-1">
          <VaultSwitch from="locked" delay={1.2} size={0.85} />
          {/* coin flies from the safe to the wallet */}
          <motion.div
            className="absolute top-[56px] z-20"
            initial={{ y: 0, opacity: 0, scale: 0.4 }}
            animate={{ y: [0, 0, 112], opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 0.5], rotateY: [0, 0, 720] }}
            transition={{ delay: 1.5, duration: 1.1, times: [0, 0.2, 0.85, 1], ease: 'easeIn' }}
          >
            <Coin size={36} />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1, 1.08, 1] }}
            transition={{ delay: 1.5, duration: 1.5, times: [0, 0.6, 0.8, 1] }}
            className="w-full rounded-[18px] bg-gradient-to-br from-[#1B2347] to-[#0A0F24] p-3 text-white shadow-[0_18px_30px_-16px_rgba(14,22,48,0.8)]"
          >
            <span className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-white/70">
                <Wallet size={13} /> Creator’s wallet
              </span>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring, delay: 2.5 }} className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Check size={11} strokeWidth={3} />
              </motion.span>
            </span>
            <p className="mt-1 font-display text-[24px] font-extrabold tracking-[-0.03em]">
              +<CountUp to={CAMPAIGN.payValue} prefix="₹" delay={2.4} duration={0.8} />
            </p>
            <p className="text-[9.5px] font-semibold text-emerald-300">Payment released</p>
          </motion.div>
        </div>
      </div>
      <Confetti delay={2.6} />
    </div>
  );
}

export const SCENES = [PostScene, ApplyScene, PayScene, DeliverScene, ReleaseScene];

/** One scene, re-played every time it becomes the active step. */
export function CampaignScene({ step }: { step: number }) {
  const Scene = SCENES[step] ?? PostScene;
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
      transition={{ duration: 0.4, ease }}
      className="absolute inset-0 bg-[#F4F5F8] text-ink"
    >
      <Scene />
    </motion.div>
  );
}