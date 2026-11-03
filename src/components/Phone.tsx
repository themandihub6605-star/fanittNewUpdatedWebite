// File: src/components/Phone.tsx  (fanitt-website)
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { cn } from './cn';

type Scroll = {
  /** A tall screenshot of the whole screen, top to bottom. */
  src: string;
  /** The app's bottom bar, kept fixed while the screen scrolls under it. */
  nav?: string;
};

/**
 * The tall screenshot slides up inside the phone like someone scrolling the
 * app: a pause at the top, a slow scroll down, a pause, then back up.
 * It only runs while the phone is on screen, and holds still under the pointer.
 */
function ScrollingScreen({ scroll, alt, priority }: { scroll: Scroll; alt: string; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const y = useMotionValue(0);
  const [distance, setDistance] = useState(0);
  const [paused, setPaused] = useState(false);
  const inView = useInView(box, { amount: 0.4 });
  const reduce = useReducedMotion();

  // How far the screenshot can move = its height minus the visible screen.
  useEffect(() => {
    const measure = () => {
      if (!box.current || !img.current) return;
      setDistance(Math.max(0, img.current.offsetHeight - box.current.offsetHeight));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    if (img.current) ro.observe(img.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!distance || !inView || paused || reduce) return;
    // Continue from wherever it is now.
    const start = y.get();
    const goingDown = start > -distance / 2 || start === 0;
    const down = { duration: Math.max(8, distance / 90), ease: [0.45, 0, 0.55, 1] as const };
    const up = { duration: Math.max(3, distance / 320), ease: [0.65, 0, 0.35, 1] as const };
    let stop = false;
    let current: ReturnType<typeof animate> | null = null;
    const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

    const loop = async () => {
      let toBottom = goingDown;
      while (!stop) {
        if (toBottom) {
          await wait(1200);
          if (stop) break;
          current = animate(y, -distance, down);
        } else {
          await wait(1600);
          if (stop) break;
          current = animate(y, 0, up);
        }
        await current;
        toBottom = !toBottom;
      }
    };
    loop();
    return () => {
      stop = true;
      current?.stop();
    };
  }, [distance, inView, paused, reduce, y]);

  return (
    <div
      ref={box}
      className="absolute inset-0"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.img
        ref={img}
        src={scroll.src}
        alt={alt}
        style={{ y }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => {
          if (box.current && img.current) setDistance(Math.max(0, img.current.offsetHeight - box.current.offsetHeight));
        }}
        className="absolute left-0 top-0 block h-auto w-full will-change-transform"
      />
      {scroll.nav && <img src={scroll.nav} alt="" draggable={false} className="absolute inset-x-0 bottom-0 block w-full shadow-[0_-6px_16px_-8px_rgba(14,22,48,0.18)]" />}
    </div>
  );
}

/** Where the light hits the glass, in % of the screen (0–100). */
export type Glare = { x: MotionValue<number>; y: MotionValue<number> };

/** Light on the glass that moves with the pointer, plus a faint rainbow edge. */
function GlassGlare({ glare }: { glare: Glare }) {
  const shine = useMotionTemplate`radial-gradient(70% 45% at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.42), rgba(255,255,255,0.1) 35%, transparent 65%)`;
  const angle = useTransform(glare.x, [0, 100], [100, 160]);
  const streak = useMotionTemplate`linear-gradient(${angle}deg, transparent 30%, rgba(255,255,255,0.32) 45%, rgba(255,255,255,0.05) 52%, transparent 60%)`;
  const edgeAngle = useTransform(glare.x, [0, 100], [0, 360]);
  const edge = useMotionTemplate`conic-gradient(from ${edgeAngle}deg, rgba(255,90,31,0.55), rgba(255,176,32,0.45), rgba(90,200,255,0.45), rgba(236,42,120,0.55), rgba(255,90,31,0.55))`;
  return (
    <>
      <motion.span aria-hidden style={{ background: shine }} className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay" />
      <motion.span aria-hidden style={{ background: streak }} className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light" />
      {/* rainbow rim on the glass edge */}
      <motion.span
        aria-hidden
        style={{
          background: edge,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1.5px',
        }}
        className="pointer-events-none absolute inset-0 z-10 rounded-[11%/5.2%] opacity-70"
      />
    </>
  );
}

/** A phone with a real Fanitt screen inside. Width drives everything. */
export function Phone({
  src,
  alt,
  className,
  priority,
  scroll,
  glare,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  scroll?: Scroll;
  glare?: Glare;
}) {
  return (
    <div
      className={cn(
        'relative aspect-[9/19.4] rounded-[13%/6%] bg-[#0b0d14] p-[3.2%] shadow-[0_40px_80px_-30px_rgba(14,22,48,0.55),0_18px_36px_-18px_rgba(14,22,48,0.35),inset_0_0_0_1.5px_rgba(255,255,255,0.14)]',
        className,
      )}
    >
      {/* side buttons */}
      <span className="absolute -left-[1.6%] top-[18%] h-[7%] w-[1.6%] rounded-l bg-[#1a1d26]" />
      <span className="absolute -left-[1.6%] top-[28%] h-[10%] w-[1.6%] rounded-l bg-[#1a1d26]" />
      <span className="absolute -right-[1.6%] top-[24%] h-[13%] w-[1.6%] rounded-r bg-[#1a1d26]" />
      <div className="relative h-full w-full overflow-hidden rounded-[11%/5.2%] bg-white">
        {scroll ? (
          <ScrollingScreen scroll={scroll} alt={alt} priority={priority} />
        ) : (
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover object-top"
          />
        )}
        {/* glass sheen */}
        {glare ? (
          <GlassGlare glare={glare} />
        ) : (
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-60" />
        )}
      </div>
    </div>
  );
}