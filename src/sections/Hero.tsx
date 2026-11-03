// File: src/sections/Hero.tsx  (fanitt-website)
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Video } from 'lucide-react';
import { SCREENS, SCROLLS } from '@/config/site';
import { Phone } from '@/components/Phone';
import { DownloadButtons } from '@/components/PlayButton';
import { EASE, Magnetic } from '@/components/motion';
import { HeroBackdrop } from './HeroBackdrop';

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Gentle tilt that follows the pointer (desktop only).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-7, 7]);
  const rotX = useTransform(sy, [-1, 1], [6, -6]);
  const shiftX = useTransform(sx, [-1, 1], [-16, 16]);

  // As you scroll away: phones spread and sink a little, text drifts up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const phonesY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const phonesScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const sideSpread = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const sideSpreadNeg = useTransform(sideSpread, (v) => -v);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // One light for all three phones: it follows the pointer (or, on phones,
  // drifts as you scroll). Each phone sees it from its own angle.
  const glareX = useTransform(sx, [-1, 1], [5, 95]);
  const glareY = useTransform(sy, [-1, 1], [5, 75]);
  const glareLeftX = useTransform(glareX, (v) => Math.min(100, v + 18));
  const glareRightX = useTransform(glareX, (v) => Math.max(0, v - 18));
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (window.matchMedia('(pointer: fine)').matches) return;
    mx.set(v * 4 - 1);
    my.set(v * 2 - 0.6);
  });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  const words = ['Where', 'creators,', 'brands', 'and', 'fans', 'meet.'];

  return (
    <section ref={ref} className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
      {/* soft page light + dot grid */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-rose/10 blur-[110px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(rgba(14,22,48,0.12) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent 75%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent to-paper" />

      <div className="page relative z-[2] grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10">
          <h1 className="text-[46px] font-extrabold leading-[0.98] sm:text-[68px] lg:text-[84px]">
            {words.map((w, i) => (
              <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '105%', rotate: 6 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.85, ease: EASE }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
            className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft sm:text-[19px]"
          >
            Fanitt is one app for India&apos;s creator economy. Creators sell paid calls and live sessions, brands hire them with
            payments held safely in escrow, and fans get closer to the people they follow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
            className="mt-9"
          >
            <DownloadButtons />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <Magnetic strength={0.2}>
              <a href="#how-it-works" className="group inline-flex items-center gap-2 text-[15px] font-bold text-ink">
                <span className="relative">
                  See how it works
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-flame transition-transform duration-500 group-hover:scale-x-100" />
                </span>
              </a>
            </Magnetic>
            <span className="text-[14px] font-medium text-ink-mute">Free to download</span>
          </motion.div>
        </motion.div>

        {/* Phones */}
        <motion.div
          style={{ y: phonesY, scale: phonesScale }}
          className="relative mx-auto h-[440px] w-full max-w-[560px] [perspective:1400px] sm:h-[560px] lg:h-[640px]"
        >
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: EASE }} className="absolute inset-0">
            <HeroBackdrop />
          </motion.div>

          <motion.div style={{ rotateX: rotX, rotateY: rotY, x: shiftX }} className="relative h-full w-full [transform-style:preserve-3d]">
            <motion.div style={{ x: sideSpreadNeg }} className="absolute inset-0">
              <motion.div
                initial={{ rotate: 0, x: '-50%', y: 30, opacity: 0 }}
                animate={{ rotate: -10, x: '-112%', y: 46, opacity: 1 }}
                transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
                whileHover={{ y: 30, rotate: -12, transition: { duration: 0.4 } }}
                className="pointer-events-auto absolute left-1/2 top-4 w-[40%] max-w-[236px]"
              >
                <Phone src={SCREENS.campaigns} alt="Campaigns in the Fanitt app" priority glare={{ x: glareLeftX, y: glareY }} />
              </motion.div>
            </motion.div>
            <motion.div style={{ x: sideSpread }} className="absolute inset-0">
              <motion.div
                initial={{ rotate: 0, x: '-50%', y: 30, opacity: 0 }}
                animate={{ rotate: 10, x: '12%', y: 46, opacity: 1 }}
                transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
                whileHover={{ y: 30, rotate: 12, transition: { duration: 0.4 } }}
                className="absolute left-1/2 top-4 w-[40%] max-w-[236px]"
              >
                <Phone src={SCREENS.communities} alt="Communities in the Fanitt app" priority glare={{ x: glareRightX, y: glareY }} />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ x: '-50%', y: 60, opacity: 0, scale: 0.94 }}
              animate={{ x: '-50%', y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: EASE }}
              whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.4 } }}
              className="absolute left-1/2 top-0 z-10 w-[46%] max-w-[272px]"
            >
              <Phone src={SCREENS.home} scroll={SCROLLS.home} alt="The Fanitt home screen" priority glare={{ x: glareX, y: glareY }} />
            </motion.div>

            {/* floating labels */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 220, damping: 16 }}
              className="absolute left-0 top-[16%] z-20 sm:left-[2%]"
            >
              <div className="flex animate-floaty items-center gap-2.5 rounded-2xl border border-white/70 bg-white/90 py-2.5 pl-2.5 pr-4 shadow-[0_18px_40px_-16px_rgba(14,22,48,0.4)] backdrop-blur">
                <span className="flame-bg flex h-9 w-9 items-center justify-center rounded-xl text-white">
                  <Video size={17} />
                </span>
                <span className="text-[13px] font-bold leading-tight">
                  Paid video calls
                  <span className="block text-[11.5px] font-medium text-ink-mute">Your rate, per minute</span>
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.35, type: 'spring', stiffness: 220, damping: 16 }}
              className="absolute right-0 top-[6%] z-20 sm:right-[4%]"
            >
              <div className="flex animate-floaty items-center gap-2 rounded-full bg-ink py-2 pl-3 pr-4 text-white shadow-[0_18px_40px_-16px_rgba(14,22,48,0.6)] [animation-delay:1.5s]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-pulseRing rounded-full bg-rose" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-rose" />
                </span>
                <span className="text-[12.5px] font-bold">Live now</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.5, type: 'spring', stiffness: 220, damping: 16 }}
              className="absolute bottom-[10%] right-0 z-20 sm:right-[2%]"
            >
              <div className="flex animate-floaty items-center gap-2.5 rounded-2xl border border-white/70 bg-white/90 py-2.5 pl-2.5 pr-4 shadow-[0_18px_40px_-16px_rgba(14,22,48,0.4)] backdrop-blur [animation-delay:3s]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <ShieldCheck size={17} />
                </span>
                <span className="text-[13px] font-bold leading-tight">
                  Escrow protected
                  <span className="block text-[11.5px] font-medium text-ink-mute">Paid when work is approved</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}