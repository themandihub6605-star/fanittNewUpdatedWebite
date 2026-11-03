// File: src/components/PlayButton.tsx  (fanitt-website)
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '@/config/site';
import { cn } from './cn';
import { Magnetic } from './motion';

function PlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 26" className={className} aria-hidden>
      <path d="M1.2.6 13.6 13 1.2 25.4A1.9 1.9 0 0 1 .6 24V2c0-.6.2-1 .6-1.4Z" fill="#00D7FE" />
      <path d="M17.7 8.9 13.6 13 1.2.6c.4-.4 1.1-.5 1.8-.1l14.7 8.4Z" fill="#00F076" />
      <path d="M17.7 17.1 3 25.5c-.7.4-1.4.3-1.8-.1L13.6 13l4.1 4.1Z" fill="#FF3A44" />
      <path d="m22.3 11.5-4.6-2.6-4.1 4.1 4.1 4.1 4.6-2.6c1.3-.7 1.3-2.3 0-3Z" fill="#FFD400" />
    </svg>
  );
}

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.37 12.7c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.23 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.02 2.28-1.27 3.13-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.12h.04ZM13.8 5.06c.71-.86 1.19-2.06 1.06-3.26-1.03.04-2.27.69-3 1.55-.66.76-1.24 1.98-1.08 3.15 1.14.09 2.31-.58 3.02-1.44Z" />
    </svg>
  );
}

function SoonText() {
  return (
    <div className="relative flex items-start gap-3">
      <span className="flame-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
        <AppleMark className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[15px] font-bold leading-tight">iPhone app coming soon</p>
        <p className="mt-1 text-[13px] leading-snug text-ink-soft">Fanitt for iPhone is on its way. Until then, get it on Android.</p>
      </div>
    </div>
  );
}

type Tone = 'dark' | 'light' | 'glass';

const TONES: Record<Tone, string> = {
  dark: 'bg-ink text-white shadow-[0_14px_30px_-12px_rgba(14,22,48,0.6)] hover:shadow-[0_22px_44px_-14px_rgba(14,22,48,0.7)]',
  light: 'bg-white text-ink shadow-[0_14px_30px_-12px_rgba(0,0,0,0.35)]',
  glass: 'border border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white/25',
};
const SUB: Record<Tone, string> = { dark: 'text-white/65', light: 'text-ink/60', glass: 'text-white/75' };

const base =
  'group relative inline-flex h-[54px] items-center gap-2.5 overflow-hidden rounded-2xl pl-3.5 pr-4 sm:h-[58px] sm:gap-3 sm:pl-4 sm:pr-6 transition-[box-shadow,background-color] duration-300';

/** Shine that sweeps across a button on hover. */
const Shine = () => (
  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
);

/** "Get it on Google Play" — opens the Play Store listing. */
export function PlayButton({ tone = 'dark', className }: { tone?: Tone; className?: string }) {
  return (
    <Magnetic>
      <a href={SITE.playStore} target="_blank" rel="noopener noreferrer" className={cn(base, TONES[tone], className)}>
        <Shine />
        <PlayMark className="h-6 w-6 transition-transform duration-500 group-hover:rotate sm:h-7 sm:w-7-[-8deg] group-hover:scale-110" />
        <span className="flex flex-col text-left leading-none">
          <span className={cn('text-[11px] font-medium', SUB[tone])}>Get it on</span>
          <span className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] sm:text-[19px]">Google Play</span>
        </span>
      </a>
    </Magnetic>
  );
}

/** "App Store" — the iPhone app isn't out yet, so it shows a coming-soon note. */
export function AppStoreButton({ tone = 'dark', className }: { tone?: Tone; className?: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), 4000);
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative inline-block">
      <Magnetic>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-describedby="ios-soon"
          className={cn(base, TONES[tone], className)}
        >
          <Shine />
          <AppleMark className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" />
          <span className="flex flex-col text-left leading-none">
            <span className={cn('text-[11px] font-medium', SUB[tone])}>Coming soon on</span>
            <span className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] sm:text-[19px]">App Store</span>
          </span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-flame">
            <span className="absolute inset-0 animate-ping rounded-full bg-flame" />
          </span>
        </button>
      </Magnetic>

      {/* desktop: a bubble above the button */}
      <AnimatePresence>
        {open && (
          <div className="absolute bottom-[calc(100%+12px)] left-1/2 z-30 hidden w-[270px] -translate-x-1/2 sm:block">
            <motion.div
              id="ios-soon"
              role="status"
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="relative rounded-2xl bg-white p-4 text-left text-ink shadow-[0_24px_60px_-18px_rgba(14,22,48,0.45)] ring-1 ring-ink/[0.06]"
            >
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
              <SoonText />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* phone: a toast at the bottom of the screen */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed inset-x-4 bottom-5 z-[80] rounded-2xl bg-white p-4 text-left text-ink shadow-[0_24px_60px_-18px_rgba(14,22,48,0.5)] ring-1 ring-ink/[0.06] sm:hidden"
            >
              <SoonText />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

/** Both store buttons side by side. */
export function DownloadButtons({ tone = 'dark', className, full }: { tone?: Tone; className?: string; full?: boolean }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5 sm:gap-3', className)}>
      <PlayButton tone={tone} className={full ? 'w-full justify-center' : undefined} />
      <AppStoreButton tone={tone} className={full ? 'w-full justify-center' : undefined} />
    </div>
  );
}