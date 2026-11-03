// File: src/sections/Community.tsx  (fanitt-website)
import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Users, Phone as PhoneIcon } from 'lucide-react';
import { SCREENS } from '@/config/site';
import { Phone } from '@/components/Phone';
import { Curve, Parallax, Reveal, RevealWords, Stagger, StaggerItem } from '@/components/motion';

const POINTS = [
  { icon: Users, title: 'Communities', text: 'Join groups around what you love, or start your own as a creator.' },
  { icon: MessageCircle, title: 'Chat', text: 'One-on-one messages, group chats and message requests in one inbox.' },
  { icon: PhoneIcon, title: 'Calls from chat', text: 'Move from a message to an audio or video call in a tap.' },
];

/**
 * A phone that shows a small glass card above it while the pointer is on it
 * (or after a tap on touch screens): what this screen is for, in one line.
 */
function LabeledPhone({
  label,
  line,
  icon: Icon,
  side,
  onChange,
  children,
}: {
  label: string;
  line: string;
  icon: typeof Users;
  side: 'left' | 'right';
  onChange?: (on: boolean) => void;
  children: ReactNode;
}) {
  const [on, setOnState] = useState(false);
  const setOn = (v: boolean | ((p: boolean) => boolean)) =>
    setOnState((prev) => {
      const next = typeof v === 'function' ? v(prev) : v;
      onChange?.(next);
      return next;
    });
  return (
    <div
      className="relative"
      style={{ zIndex: on ? 30 : undefined }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <AnimatePresence>
        {on && (
          <div className={`pointer-events-none absolute -top-[86px] z-30 w-[240px] sm:w-[260px] ${side === 'left' ? 'left-[-6%]' : 'right-[-6%]'}`}>
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.85, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 10, scale: 0.92, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              className="relative flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 p-3 pr-4 shadow-[0_24px_50px_-18px_rgba(14,22,48,0.45),0_0_0_6px_rgba(255,90,31,0.08)] backdrop-blur-xl"
            >
              <motion.span
                initial={{ rotate: -20, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.05 }}
                className="flame-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_10px_20px_-8px_rgba(255,90,31,0.9)]"
              >
                <Icon size={20} />
              </motion.span>
              <span className="min-w-0">
                <span className="block font-display text-[17px] font-extrabold leading-tight tracking-[-0.02em] text-ink">{label}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-soft">{line}</span>
              </span>
              {/* little pointer down to the phone */}
              <span className={`absolute -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-white/80 bg-white/90 ${side === 'left' ? 'left-14' : 'right-14'}`} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

export function Community() {
  // The phone being pointed at comes in front of the other one.
  const [front, setFront] = useState<'communities' | 'messages' | null>(null);
  return (
    <section className="relative">
      <Curve fill="#F6EEE7" />
      <div className="relative overflow-hidden bg-sand py-16 lg:py-24">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 animate-floaty rounded-full bg-rose/15 blur-[110px]" />
        <div className="page relative grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <RevealWords text="Where your people already are." className="text-[38px] font-extrabold leading-[1.02] sm:text-[52px]" />
            <Reveal delay={0.15}>
              <p className="mt-4 max-w-lg text-[17px] text-ink-soft">Fanitt is not just a marketplace. It is a place to talk, share and grow together.</p>
            </Reveal>
            <Stagger className="mt-10 space-y-3">
              {POINTS.map(({ icon: Icon, title, text }) => (
                <StaggerItem key={title}>
                  <div className="group flex items-start gap-4 rounded-3xl border border-transparent bg-white/0 p-4 transition-all duration-500 hover:border-white hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(14,22,48,0.4)]">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-flame shadow-sm transition-all duration-500 group-hover:rotate-[10deg] group-hover:bg-flame group-hover:text-white">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="font-sans text-[17px] font-bold tracking-[-0.01em]">{title}</h3>
                      <p className="mt-1 text-[15px] text-ink-soft">{text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="relative mx-auto flex w-full max-w-[540px] justify-center">
            <Parallax distance={50} className={`relative w-[48%] ${front === 'communities' ? 'z-20' : 'z-0'}`}>
              <motion.div
                initial={{ opacity: 0, x: -60, rotate: -14 }}
                whileInView={{ opacity: 1, x: 0, rotate: -5 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: -8, y: -10 }}
                className="mt-8"
              >
                <LabeledPhone icon={Users} side="left" label="Communities" line="Join groups around what you love" onChange={(on) => setFront(on ? 'communities' : null)}>
                  <Phone src={SCREENS.communities} alt="Communities in the Fanitt app" />
                </LabeledPhone>
              </motion.div>
            </Parallax>
            <Parallax distance={-30} className="relative z-10 -ml-[8%] w-[48%]">
              <motion.div
                initial={{ opacity: 0, x: 60, rotate: 14 }}
                whileInView={{ opacity: 1, x: 0, rotate: 4 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: 7, y: -10 }}
              >
                <LabeledPhone icon={MessageCircle} side="right" label="Chat" line="Messages, groups and calls in one inbox" onChange={(on) => setFront(on ? 'messages' : null)}>
                  <Phone src={SCREENS.messages} alt="Messages in the Fanitt app" />
                </LabeledPhone>
              </motion.div>
            </Parallax>
          </div>
        </div>
      </div>
      <Curve fill="#F6EEE7" flip />
    </section>
  );
}