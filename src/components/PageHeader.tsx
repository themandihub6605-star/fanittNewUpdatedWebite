// File: src/components/PageHeader.tsx  (fanitt-website)
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE, RevealWords } from './motion';

export function PageHeader({ title, intro, children }: { title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-32 sm:pt-40">
      <motion.div
        animate={{ x: [0, 30, -10, 0], y: [0, 20, 10, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-32 -top-10 h-[420px] w-[420px] rounded-full bg-flame/25 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -20, 20, 0], y: [0, -10, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-40 top-40 h-72 w-72 rounded-full bg-rose/10 blur-[100px]"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(rgba(14,22,48,0.12) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 60% 70% at 85% 20%, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 85% 20%, black, transparent 70%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-paper" />
      <div className="page relative">
        <RevealWords as="h1" text={title} className="max-w-4xl text-[46px] font-extrabold leading-[1] sm:text-[68px] lg:text-[80px]" />
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
            className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-soft sm:text-[19px]"
          >
            {intro}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: EASE }}>
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}