// File: src/sections/ScreensStrip.tsx  (fanitt-website)
import { useEffect, useRef, useState, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { SCREENS, SCROLLS } from '@/config/site';
import { Phone } from '@/components/Phone';
import { Reveal, RevealWords } from '@/components/motion';

const LIST = [
  { src: SCREENS.home, alt: 'Home', line: 'Your store, brands and campaigns in one place', scroll: SCROLLS.home as { src: string; nav?: string } | undefined },
  { src: SCREENS.feed, alt: 'Feed', line: 'Posts from the creators you follow' },
  { src: SCREENS.campaigns, alt: 'Campaigns', line: 'Paid brand work, safe with escrow' },
  { src: SCREENS.communities, alt: 'Communities', line: 'Groups around what you love' },
  { src: SCREENS.messages, alt: 'Messages', line: 'Chats, groups and calls' },
  { src: SCREENS.profile, alt: 'Creator profile', line: 'Your work, followers and earnings' },
];

const spring = { type: 'spring', stiffness: 260, damping: 24 } as const;

/** The back of the phone, seen while it spins. */
function PhoneBack({ title, line }: { title: string; line: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[13%/6%] bg-[linear-gradient(155deg,#FF6A1F_0%,#FF3D5A_38%,#EC2A78_62%,#0A0F24_100%)] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.18)]">
      {/* sheen that sweeps across the back */}
      <motion.span
        aria-hidden
        className="absolute -inset-y-4 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ x: ['-120%', '260%'] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
      />
      {/* soft rings */}
      <span className="absolute left-1/2 top-[52%] aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <span className="absolute left-1/2 top-[52%] aspect-square w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />

      {/* camera module */}
      <div className="absolute left-[8%] top-[4%] grid h-[17%] w-[38%] grid-cols-2 place-items-center gap-[6%] rounded-[28%] bg-black/35 p-[6%] ring-1 ring-white/15 backdrop-blur-sm">
        {[0, 1, 2].map((k) => (
          <span key={k} className="aspect-square w-full rounded-full bg-[radial-gradient(circle_at_35%_35%,#3a4060,#05060a_70%)] ring-2 ring-white/10" />
        ))}
        <span className="aspect-square w-[40%] rounded-full bg-amber-100/80 shadow-[0_0_8px_rgba(255,220,150,0.9)]" />
      </div>

      {/* logo + what this screen is */}
      <div className="absolute inset-x-[10%] top-[40%] flex flex-col items-center text-center">
        <img src="/logo.png" alt="" className="w-[62%] brightness-0 invert" draggable={false} />
        <span className="mt-4 h-px w-10 bg-white/40" />
        <p className="mt-4 font-display text-[19px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[22px]">{title}</p>
        <p className="mt-1.5 font-sans text-[11.5px] font-medium leading-snug text-white/75 sm:text-[12.5px]">{line}</p>
      </div>

      <p className="absolute inset-x-0 bottom-[5%] text-center font-sans text-[10px] font-semibold text-white/55">fanitt.com</p>
    </div>
  );
}

/**
 * One phone in the strip. When the pointer is on it, it comes forward, grows,
 * tilts with the pointer and lights up from behind. When another phone is
 * active, this one steps back: smaller, blurred and faded.
 */
function ScreenCard({
  src,
  alt,
  line,
  state,
  onEnter,
  onLeave,
  onOpen,
  hidden,
}: {
  src: string;
  alt: string;
  line: string;
  state: 'idle' | 'active' | 'dimmed';
  onEnter: () => void;
  onLeave: () => void;
  onOpen: () => void;
  hidden: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 16 });
  const ry = useSpring(0, { stiffness: 180, damping: 16 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(40);
  // Orange ripple from the point you click, then the full view opens.
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const onClick = (e: RMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((list) => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    window.setTimeout(() => setRipples((list) => list.filter((it) => it.id !== id)), 700);
    window.setTimeout(onOpen, 260);
  };
  // Turns all the way round when the pointer arrives:
  // half a turn, a short stop to show the back, then the other half.
  const spin = useMotionValue(0);
  const spinning = useRef(false);
  const rotateY = useTransform([ry, spin], ([a, b]: number[]) => a + b);
  const spinOnce = () => {
    if (spinning.current) return;
    spinning.current = true;
    const from = Math.round(spin.get() / 360) * 360;
    animate(spin, [from, from + 180, from + 180, from + 360], {
      duration: 3.2,
      times: [0, 0.36, 0.64, 1],
      ease: [[0.65, 0, 0.35, 1], 'linear', [0.65, 0, 0.35, 1]],
      onComplete: () => {
        spinning.current = false;
      },
    });
  };
  const glow = useMotionTemplate`radial-gradient(60% 50% at ${gx}% ${gy}%, rgba(255,90,31,0.75), rgba(236,42,120,0.45) 45%, transparent 75%)`;

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 40);
    rx.set(-(py - 0.5) * 26);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(40);
  };

  const active = state === 'active';
  const dimmed = state === 'dimmed';

  return (
    <motion.div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        onEnter();
        spinOnce();
      }}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={() => {
        reset();
        onLeave();
      }}
      animate={{
        scale: active ? 1.18 : dimmed ? 0.92 : 1,
        y: active ? -18 : 0,
        opacity: dimmed ? 0.45 : 1,
        filter: dimmed ? 'blur(3px) saturate(0.6)' : 'blur(0px) saturate(1)',
      }}
      transition={spring}
      style={{ zIndex: active ? 20 : 1, transformPerspective: 1000 }}
      className="relative w-[180px] shrink-0 sm:w-[220px]"
      aria-hidden={hidden}
    >
      {/* light behind the phone */}
      <motion.span
        aria-hidden
        animate={{ opacity: active ? 1 : 0, scale: active ? 1.15 : 0.8 }}
        transition={{ duration: 0.4 }}
        style={{ background: glow }}
        className="pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 rounded-full blur-3xl"
      />

      <motion.div style={{ rotateX: rx, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1200 }} className="relative cursor-pointer">
        <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          <Phone src={src} alt={alt} />
        </div>
        <div style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} className="absolute inset-0">
          <PhoneBack title={alt} line={line} />
        </div>
      </motion.div>

      {/* click ripple */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ left: r.x - 160, top: r.y - 160 }}
          className="pointer-events-none absolute z-30 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.55),rgba(236,42,120,0.35)_45%,transparent_70%)]"
        />
      ))}

      {/* shadow on the "floor" */}
      <motion.span
        aria-hidden
        animate={{ opacity: active ? 0.55 : 0.2, scaleX: active ? 0.75 : 0.9, y: active ? 18 : 0 }}
        transition={spring}
        className="pointer-events-none mx-auto mt-3 block h-3 w-[70%] rounded-[50%] bg-ink/40 blur-md"
      />

      <motion.p
        animate={{ y: active ? 10 : 0, color: active ? '#FF5A1F' : '#3B4463' }}
        transition={spring}
        className="mt-2 text-center text-[14px] font-bold"
      >
        {alt}
      </motion.p>
    </motion.div>
  );
}

/**
 * Full view: one screen large in the middle, the page blurred behind it.
 * Arrows, swipe or the keyboard move between screens; Esc or ✕ closes.
 */
function Lightbox({ index, onClose, onGo }: { index: number; onClose: () => void; onGo: (i: number) => void }) {
  const [dir, setDir] = useState(1);
  const item = LIST[index];
  const go = (step: number) => {
    setDir(step);
    onGo((index + step + LIST.length) % LIST.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  });

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.alt} screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-night/75 px-4 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* colour light behind the phone */}
      <motion.span
        aria-hidden
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.55),rgba(236,42,120,0.35)_45%,transparent_70%)] blur-3xl"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-all hover:rotate-90 hover:bg-white/20 sm:right-8 sm:top-8"
      >
        <X size={22} />
      </button>

      <div className="relative flex w-full max-w-5xl items-center justify-center gap-4 sm:gap-10" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous screen"
          className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-all hover:-translate-x-1 hover:bg-flame sm:flex"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative h-[min(68vh,620px)] aspect-[9/19.4]">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d * 260, opacity: 0, rotateY: d * -35, scale: 0.85 }),
                  center: { x: 0, opacity: 1, rotateY: 0, scale: 1 },
                  exit: (d: number) => ({ x: d * -260, opacity: 0, rotateY: d * 35, scale: 0.85 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) go(1);
                  else if (info.offset.x > 70) go(-1);
                }}
                style={{ transformPerspective: 1200 }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <motion.div initial={{ y: 40, scale: 0.9 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="h-full">
                  <Phone src={item.src} scroll={item.scroll} alt={item.alt} priority className="h-full w-auto" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.alt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-6 text-center"
            >
              <p className="font-display text-[26px] font-extrabold tracking-[-0.03em] text-white sm:text-[30px]">{item.alt}</p>
              <p className="mt-1 text-[15px] text-white/65">{item.line}</p>
            </motion.div>
          </AnimatePresence>

          {/* dots */}
          <div className="mt-5 flex items-center gap-2">
            {LIST.map((it, i) => (
              <button
                key={it.alt}
                type="button"
                aria-label={`Show ${it.alt}`}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  onGo(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-flame' : 'w-2 bg-white/35 hover:bg-white/60'}`}
              />
            ))}
          </div>
          <p className="mt-3 text-[12.5px] text-white/45 sm:hidden">Swipe to see more</p>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next screen"
          className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-all hover:translate-x-1 hover:bg-flame sm:flex"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}

/** An endless row of real app screens that also slides with the scroll. Pauses on hover. */
export function ScreensStrip() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const [hovered, setHovered] = useState<number | null>(null);
  const [opened, setOpened] = useState<number | null>(null);
  const row = [...LIST, ...LIST];

  return (
    <section ref={ref} aria-label="Screens from the Fanitt app" className="overflow-hidden py-16 lg:py-20">
      <div className="page -mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <RevealWords text="A look inside the app." className="text-[34px] font-extrabold leading-[1.02] sm:text-[44px]" />
        <Reveal delay={0.2}>
          <p className="max-w-sm text-[15.5px] text-ink-soft">Real screens from the Fanitt app. Point at a screen to spin it, click to see it full size.</p>
        </Reveal>
      </div>
      <motion.div style={{ x }} className="relative [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div
          className="flex w-max animate-marquee items-start gap-6 py-20 sm:gap-10"
          style={{ animationPlayState: hovered === null ? 'running' : 'paused' }}
        >
          {row.map((s, i) => (
            <ScreenCard
              key={i}
              src={s.src}
              alt={s.alt}
              line={s.line}
              hidden={i >= LIST.length}
              state={hovered === null ? 'idle' : hovered === i ? 'active' : 'dimmed'}
              onEnter={() => setHovered(i)}
              onOpen={() => {
                setHovered(null);
                setOpened(i % LIST.length);
              }}
              onLeave={() => setHovered((h) => (h === i ? null : h))}
            />
          ))}
        </div>
      </motion.div>
      <AnimatePresence>{opened !== null && <Lightbox index={opened} onClose={() => setOpened(null)} onGo={setOpened} />}</AnimatePresence>
    </section>
  );
}