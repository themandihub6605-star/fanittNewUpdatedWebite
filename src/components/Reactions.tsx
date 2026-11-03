// File: src/components/Reactions.tsx  (fanitt-website)
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Flame, Gift, Heart, MessageCircle, Star } from 'lucide-react';

const KINDS = [
  { icon: Heart, color: '#EC2A78', fill: true },
  { icon: Heart, color: '#FF3D5A', fill: true },
  { icon: MessageCircle, color: '#0E1630', fill: false },
  { icon: Star, color: '#FFB020', fill: true },
  { icon: Gift, color: '#FF5A1F', fill: false },
  { icon: Flame, color: '#FF5A1F', fill: true },
];

type Bubble = { id: number; kind: number; x: number; drift: number; rise: number; size: number; spin: number; dur: number };

let nextId = 1;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makeBubble(burst = false): Bubble {
  return {
    id: nextId++,
    kind: burst && Math.random() < 0.6 ? 0 : Math.floor(Math.random() * KINDS.length),
    x: rand(18, 82),
    drift: rand(-60, 60),
    rise: rand(260, 440),
    size: rand(34, 50),
    spin: rand(-25, 25),
    dur: rand(2.2, 3.4),
  };
}

/**
 * Live-style reactions: hearts, comments, stars, gifts and flames float up
 * from the phone while the pointer is on it. A click (or tap) sends a burst
 * of hearts. On touch screens a few float up on their own while it's in view.
 */
export function Reactions({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [hovering, setHovering] = useState(false);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();

  const add = (list: Bubble[]) => setBubbles((b) => [...b.slice(-40), ...list]);
  const remove = (id: number) => setBubbles((b) => b.filter((x) => x.id !== id));

  // While the pointer is on the phone: one every ~0.22s.
  useEffect(() => {
    if (!hovering || reduce) return;
    add([makeBubble()]);
    const t = window.setInterval(() => add([makeBubble()]), 220);
    return () => window.clearInterval(t);
  }, [hovering, reduce]);

  // Touch screens: a couple every 1.6s while it's on screen.
  useEffect(() => {
    if (!inView || reduce || window.matchMedia('(pointer: fine)').matches) return;
    const t = window.setInterval(() => add([makeBubble(), makeBubble()]), 1600);
    return () => window.clearInterval(t);
  }, [inView, reduce]);

  const burst = () => {
    if (reduce) return;
    add(Array.from({ length: 14 }, () => makeBubble(true)));
  };

  return (
    <div
      ref={ref}
      className={`relative ${className ?? ''}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onClick={burst}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[18%] z-20 h-0">
        <AnimatePresence>
          {bubbles.map((b) => {
            const K = KINDS[b.kind];
            const Icon = K.icon;
            return (
              <motion.span
                key={b.id}
                initial={{ opacity: 0, y: 0, x: 0, scale: 0.3, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: -b.rise,
                  x: [0, b.drift * 0.4, -b.drift * 0.3, b.drift],
                  scale: [0.3, 1.1, 1, 0.85],
                  rotate: b.spin,
                }}
                transition={{ duration: b.dur, ease: 'easeOut', times: [0, 0.15, 0.7, 1] }}
                onAnimationComplete={() => remove(b.id)}
                style={{ left: `${b.x}%`, width: b.size, height: b.size, marginLeft: -b.size / 2 }}
                className="absolute bottom-0 flex items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-[0_12px_24px_-10px_rgba(14,22,48,0.45)] backdrop-blur"
              >
                <Icon size={b.size * 0.48} color={K.color} fill={K.fill ? K.color : 'none'} strokeWidth={2.2} />
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}