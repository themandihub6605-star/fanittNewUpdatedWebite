// File: src/sections/Cta.tsx  (fanitt-website)
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SCREENS } from '@/config/site';
import { Phone } from '@/components/Phone';
import { Reactions } from '@/components/Reactions';
import { DownloadButtons } from '@/components/PlayButton';
import { Reveal, RevealWords } from '@/components/motion';

export function Cta({ title = 'Your place in the creator economy starts here.', text = 'Download Fanitt for free and set up your profile in a few minutes.' }: { title?: string; text?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [140, -40]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [16, 2]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section className="px-3 pb-20 sm:px-5 lg:pb-28">
      <div ref={ref} className="flame-bg grain relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] sm:rounded-[48px]">
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 animate-floaty rounded-full bg-sun/50 blur-[100px]" />
        {/* turning rings */}
        <motion.div style={{ rotate: ringRotate }} className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full border-[1.5px] border-dashed border-white/30" />
        <motion.div style={{ rotate: ringRotate }} className="pointer-events-none absolute -right-16 -top-16 h-[380px] w-[380px] rounded-full border border-white/20" />

        <div className="page relative grid items-end gap-10 pt-16 md:grid-cols-[1.3fr_1fr] lg:pt-20">
          <div className="pb-4 md:pb-20">
            <RevealWords text={title} className="text-[38px] font-extrabold leading-[1.02] text-white sm:text-[56px]" />
            <Reveal delay={0.2}>
              <p className="mt-4 max-w-md text-[17px] text-white/85">{text}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <DownloadButtons className="mt-8" />
            </Reveal>
          </div>
          <motion.div style={{ y: phoneY, rotate: phoneRotate }} className="mx-auto -mb-24 w-[58%] max-w-[280px] md:-mb-28 md:w-full">
            <Reactions className="cursor-pointer">
              <motion.div whileHover={{ y: -14, rotate: -3 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
                <Phone src={SCREENS.feed} alt="The Fanitt feed" />
              </motion.div>
            </Reactions>
          </motion.div>
        </div>
      </div>
    </section>
  );
}