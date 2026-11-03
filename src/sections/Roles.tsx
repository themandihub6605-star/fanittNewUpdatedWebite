// File: src/sections/Roles.tsx  (fanitt-website)
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  Gift,
  Heart,
  IndianRupee,
  Lock,
  Megaphone,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { ROLES, type RoleKey } from '@/config/roles';
import { EASE, Reveal, RevealWords } from '@/components/motion';
import { cn } from '@/components/cn';

/* ---------- look of each role ---------- */

const LOOK: Record<RoleKey, { icon: LucideIcon; bg: string; glow: string; chip: string }> = {
  creators: { icon: Sparkles, bg: 'from-[#FF6A1F] via-[#FF3D5A] to-[#EC2A78]', glow: 'rgba(255,176,32,0.55)', chip: 'text-[#FF5A1F]' },
  brands: { icon: Building2, bg: 'from-[#0E1630] via-[#1B2552] to-[#2B1E5C]', glow: 'rgba(255,90,31,0.5)', chip: 'text-[#0E1630]' },
  fans: { icon: Heart, bg: 'from-[#EC2A78] via-[#B4237A] to-[#5B21B6]', glow: 'rgba(255,120,180,0.55)', chip: 'text-[#EC2A78]' },
  agencies: { icon: Users, bg: 'from-[#FFB020] via-[#FF7A2F] to-[#FF5A1F]', glow: 'rgba(255,255,255,0.45)', chip: 'text-[#E8430A]' },
};

const KEYS = Object.keys(ROLES) as RoleKey[];

/* ---------- small pieces ---------- */

/** A white floating card. Position it with [className] (outer box never animates). */
function Chip({ icon: Icon, children, className, delay = 0, tint }: { icon: LucideIcon; children: ReactNode; className?: string; delay?: number; tint: string }) {
  return (
    <div className={cn('absolute', className)}>
      <motion.div initial={{ opacity: 0, scale: 0.6, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay }}>
        <div
          className="flex animate-floaty items-center gap-2 whitespace-nowrap rounded-2xl bg-white/95 px-3 py-2 text-[12.5px] font-bold text-ink shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)]"
          style={{ animationDelay: `${delay * 2}s` }}
        >
          <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg bg-black/[0.05]', tint)}>
            <Icon size={15} />
          </span>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function Person({ size = 52, ring = 'ring-white/40', className }: { size?: number; ring?: string; className?: string }) {
  return (
    <span className={cn('flex items-center justify-center rounded-full bg-white/20 ring-4 backdrop-blur', ring, className)} style={{ width: size, height: size }}>
      <UserRound size={size * 0.46} className="text-white" />
    </span>
  );
}

/* ---------- one live picture per role (shown when its panel is open) ---------- */

function CreatorArt({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, delay: i * 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-white/60"
          />
        ))}
        <Person size={92} />
      </div>
      <Chip icon={Video} tint={tint} className="left-[6%] top-[12%]" delay={0.15}>
        Paid call · <IndianRupee size={11} className="-mx-1" />/min
      </Chip>
      <Chip icon={Radio} tint={tint} className="right-[6%] top-[28%]" delay={0.3}>
        You’re live
      </Chip>
      <Chip icon={Gift} tint={tint} className="bottom-[24%] left-[8%]" delay={0.45}>
        FanBox gift
      </Chip>
      <Chip icon={Megaphone} tint={tint} className="bottom-[10%] right-[8%]" delay={0.6}>
        Brand campaign
      </Chip>
    </div>
  );
}

function BrandArt() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
        <motion.span
          animate={{ boxShadow: ['0 0 0 0 rgba(255,90,31,0.5)', '0 0 0 22px rgba(255,90,31,0)'] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flame-bg flex h-[84px] w-[84px] items-center justify-center rounded-[26px] text-white"
        >
          <Building2 size={36} />
        </motion.span>
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: 1, x: Math.cos(a) * 122, y: Math.sin(a) * 98, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.15 + i * 0.08 }}
            className="absolute left-1/2 top-[44%] -ml-5 -mt-5"
          >
            <span className="relative flex">
              <Person size={40} ring="ring-white/25" />
              <BadgeCheck size={15} className="absolute -bottom-0.5 -right-0.5 rounded-full bg-[#0E1630] text-sky-400" />
            </span>
          </motion.span>
        );
      })}
      <Chip icon={ShieldCheck} tint="text-emerald-600" className="bottom-[8%] left-1/2 -translate-x-1/2" delay={0.7}>
        <Lock size={11} /> Paid only when work is approved
      </Chip>
    </div>
  );
}

function FanArt({ tint }: { tint: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
        <Person size={86} />
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -230, opacity: [0, 1, 0], x: [0, i % 2 ? 14 : -14, 0] }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
          className="absolute bottom-[8%]"
          style={{ left: `${20 + ((i * 37) % 60)}%` }}
        >
          <Heart size={16 + (i % 3) * 5} className="text-white" fill={i % 2 ? '#ffffff' : '#FFD1E3'} />
        </motion.span>
      ))}
      <Chip icon={MessageCircle} tint={tint} className="left-[6%] top-[14%]" delay={0.15}>
        Loved your reel!
      </Chip>
      <Chip icon={Video} tint={tint} className="right-[6%] top-[30%]" delay={0.3}>
        Call booked
      </Chip>
      <Chip icon={Star} tint="text-[#FFB020]" className="bottom-[14%] left-[10%]" delay={0.45}>
        Joined a community
      </Chip>
    </div>
  );
}

function AgencyArt({ tint }: { tint: string }) {
  const spots = [
    [-124, -70],
    [124, -62],
    [-130, 64],
    [126, 72],
    [0, -120],
  ];
  return (
    <div className="absolute inset-0">
      {spots.map(([x, y], i) => {
        const len = Math.hypot(x, y);
        const deg = (Math.atan2(y, x) * 180) / Math.PI;
        return (
          <div key={`l${i}`} aria-hidden className="absolute left-1/2 top-[44%] h-0 origin-left" style={{ width: len, transform: `rotate(${deg}deg)` }}>
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: EASE }}
              className="block h-0 w-full origin-left border-t-2 border-dashed border-white/55"
            />
          </div>
        );
      })}
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
        <span className="flex h-[78px] w-[78px] items-center justify-center rounded-[24px] bg-white text-[#E8430A] shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)]">
          <Users size={34} />
        </span>
      </div>
      {spots.map(([x, y], i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, x, y }}
          animate={{ opacity: 1, scale: 1, x, y }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.5 + i * 0.12 }}
          className="absolute left-1/2 top-[44%] -ml-[19px] -mt-[19px]"
        >
          <Person size={38} ring="ring-white/40" />
        </motion.span>
      ))}
      <Chip icon={Check} tint={tint} className="bottom-[8%] left-1/2 -translate-x-1/2" delay={0.9}>
        Creators joined with your code
      </Chip>
    </div>
  );
}

const ART: Record<RoleKey, (p: { tint: string }) => JSX.Element> = {
  creators: CreatorArt,
  brands: BrandArt,
  fans: FanArt,
  agencies: AgencyArt,
};

/* ---------- a panel ---------- */

function Panel({ k, open, onOpen }: { k: RoleKey; open: boolean; onOpen: () => void }) {
  const role = ROLES[k];
  const look = LOOK[k];
  const Icon = look.icon;
  const Art = ART[k];

  return (
    <motion.div
      layout
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpen()}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`Fanitt for ${role.label.toLowerCase()}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      transition={{ layout: { duration: 0.6, ease: EASE } }}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-[30px] bg-gradient-to-br text-white',
        look.bg,
        open ? 'h-[580px] sm:h-[520px] lg:h-auto lg:flex-[3.4]' : 'h-[88px] lg:h-auto lg:flex-1',
      )}
    >
      <span className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: look.glow }} />
      <span className="grain pointer-events-none absolute inset-0" />

      {/* closed: icon + name (rotated on desktop) */}
      <AnimatePresence initial={false}>
        {!open && (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-between px-5 lg:flex-col lg:px-0 lg:py-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110">
              <Icon size={22} />
            </span>
            <span className="font-display text-[26px] font-extrabold tracking-[-0.03em] lg:-rotate-90 lg:whitespace-nowrap lg:text-[34px]">{role.label}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* open: words on one side, live picture on the other */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="absolute inset-0 grid grid-rows-[auto_1fr] md:grid-cols-[1fr_1.05fr] md:grid-rows-1"
          >
            <div className="relative z-10 flex flex-col p-6 sm:p-8">
              <motion.span
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                className="inline-flex w-max items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-bold ring-1 ring-white/25 backdrop-blur"
              >
                <Icon size={14} /> For {role.label.toLowerCase()}
              </motion.span>
              <motion.h3
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.6, ease: EASE }}
                className="mt-4 text-[28px] font-extrabold leading-[1.04] text-white sm:text-[38px]"
              >
                {role.title}
              </motion.h3>
              <ul className="mt-5 hidden space-y-2.5 md:block">
                {role.points.map((p, i) => (
                  <motion.li
                    key={p.title}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.38 + i * 0.07, duration: 0.45, ease: EASE }}
                    className="flex items-center gap-2.5 text-[15px] font-semibold text-white/90"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                      <Check size={12} strokeWidth={3.2} />
                    </span>
                    {p.title}
                  </motion.li>
                ))}
              </ul>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/85 md:hidden">{role.line}</p>
              <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-5 md:mt-auto md:pt-5">
                <Link
                  to={`/${k}`}
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-[15px] font-bold text-ink shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5"
                >
                  Fanitt for {role.label.toLowerCase()}
                  <ArrowUpRight size={17} className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </Link>
              </motion.div>
            </div>
            <div className="relative min-h-[280px]">
              <Art tint={look.chip} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- section ---------- */

export function Roles() {
  const [active, setActive] = useState<RoleKey>('creators');

  return (
    <section className="relative py-20 lg:py-24">
      <div className="page">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <RevealWords text="One app, four ways in." className="text-[38px] font-extrabold leading-[1.02] sm:text-[52px]" />
          <Reveal delay={0.15}>
            <p className="max-w-md text-[16.5px] text-ink-soft">Pick who you are. Fanitt opens a home, tools and a menu made for you.</p>
          </Reveal>
        </div>

        <Reveal from="blur" className="mt-10">
          <div className="flex flex-col gap-3 lg:h-[520px] lg:flex-row">
            {KEYS.map((k) => (
              <Panel key={k} k={k} open={k === active} onOpen={() => setActive(k)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}