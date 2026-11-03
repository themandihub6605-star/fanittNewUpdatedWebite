// File: src/components/Accordion.tsx  (fanitt-website)
import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from './cn';

export function Accordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className={cn('divide-y divide-ink/[0.08] border-y border-ink/[0.08]', className)}>
      {items.map((item, i) => {
        const on = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`${base}-${i}`}
              onClick={() => setOpen(on ? null : i)}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className={cn('text-[17px] font-bold tracking-[-0.01em] transition-all duration-300 group-hover:translate-x-1.5 sm:text-[19px]', on ? 'text-flame' : 'group-hover:text-flame')}>{item.q}</span>
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                  on ? 'rotate-45 bg-flame text-white' : 'bg-sand text-ink group-hover:rotate-90 group-hover:bg-flame-soft group-hover:text-flame',
                )}
              >
                <Plus size={18} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`${base}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-[15.5px] leading-relaxed text-ink-soft">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}