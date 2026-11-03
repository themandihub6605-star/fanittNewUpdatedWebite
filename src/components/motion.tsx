// File: src/components/motion.tsx  (fanitt-website)
import { useRef, type ReactNode, type PointerEvent as RPointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type Variants } from 'framer-motion';
import { cn } from './cn';

export const EASE = [0.22, 1, 0.36, 1] as const;

type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

const OFFSET: Record<RevealFrom, Record<string, number | string>> = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -56 },
  right: { x: 56 },
  scale: { scale: 0.92 },
  blur: { y: 24, filter: 'blur(12px)' },
};

/** Fades a block in as it scrolls into view. */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  duration = 0.9,
  className,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  from?: RevealFrom;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...OFFSET[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
};

/** Children marked with <StaggerItem> appear one after another. */
export function Stagger({ children, className, as = 'div', amount = 0.2 }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol'; amount?: number }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  );
}

/** A heading whose words rise up out of a mask, one by one. */
export function RevealWords({ text, className, as = 'h2', delay = 0 }: { text: string; className?: string; as?: 'h1' | 'h2' | 'h3'; delay?: number }) {
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.06, delayChildren: delay }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } } }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Pulls its child gently toward the pointer. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16 });
  const y = useSpring(0, { stiffness: 220, damping: 16 });
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x, y }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * A card with a soft glow that follows the pointer and a slight 3D tilt.
 * tone: 'light' on light backgrounds, 'dark' on dark ones.
 */
export function Spotlight({
  children,
  className,
  tone = 'light',
  tilt = 6,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark' | 'flame';
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const rx = useSpring(0, { stiffness: 160, damping: 18 });
  const ry = useSpring(0, { stiffness: 160, damping: 18 });
  const glow =
    tone === 'dark'
      ? 'rgba(255,90,31,0.22)'
      : tone === 'flame'
        ? 'rgba(255,255,255,0.28)'
        : 'rgba(255,90,31,0.14)';
  const bg = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${glow}, transparent 70%)`;

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px);
    my.set(py);
    ry.set(((px / r.width) * 2 - 1) * tilt);
    rx.set(-((py / r.height) * 2 - 1) * tilt);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(-400);
        my.set(-400);
        rx.set(0);
        ry.set(0);
      }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn('group/spot relative isolate overflow-hidden', className)}
    >
      <motion.span aria-hidden style={{ background: bg }} className="pointer-events-none absolute inset-0 -z-[1] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100" />
      {children}
    </motion.div>
  );
}

/** Moves its child up/down a little while the page scrolls past it. */
export function Parallax({ children, distance = 60, className }: { children: ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Thin flame-coloured bar at the very top that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  return <motion.div aria-hidden style={{ scaleX }} className="flame-bg fixed inset-x-0 top-0 z-[60] h-[3px] origin-left" />;
}

/** Curved edge between two sections. Put it at the top or bottom of a section. */
export function Curve({ fill, flip = false, className }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 90" preserveAspectRatio="none" className={cn('pointer-events-none block h-[44px] w-full sm:h-[72px]', flip && 'rotate-180', className)}>
      <path d="M0,90 C300,10 520,0 720,0 C920,0 1140,10 1440,90 Z" fill={fill} />
    </svg>
  );
}