import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { SITE } from '@/config/site';
import { cn } from './cn';

const XMark = (p: { size?: number }) => (
  <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.8 2.5h3.3l-7.2 8.2 8.5 10.8h-6.6l-5.2-6.6-6 6.6H1.3l7.7-8.8L.9 2.5h6.8l4.7 6.1 5.4-6.1Zm-1.2 17h1.8L6.7 4.3H4.8l11.8 15.2Z" />
  </svg>
);
const ThreadsMark = (p: { size?: number }) => (
  <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.3 11.1c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.6-4.7h-.1c-1.6 0-3 .7-3.9 2l1.5 1c.6-.9 1.6-1.1 2.4-1.1 1 0 1.7.3 2.2.9.3.4.6 1 .7 1.7-.8-.1-1.6-.2-2.5-.1-2.5.1-4.1 1.6-4 3.7.1 1.1.6 2 1.5 2.6.8.5 1.8.8 2.8.7 1.4-.1 2.5-.6 3.2-1.6.6-.7.9-1.7 1-2.9.7.4 1.2.9 1.4 1.6.5 1.1.5 2.9-1 4.4-1.3 1.3-2.9 1.9-5.3 1.9-2.6 0-4.6-.9-5.9-2.5-1.2-1.5-1.8-3.7-1.9-6.5.1-2.8.7-5 1.9-6.5 1.3-1.7 3.3-2.5 5.9-2.5 2.7 0 4.7.9 6 2.5.7.8 1.1 1.8 1.4 3l1.8-.5c-.4-1.4-.9-2.7-1.8-3.7-1.7-2.1-4.2-3.2-7.4-3.2-3.2 0-5.7 1.1-7.4 3.2-1.5 1.9-2.3 4.5-2.3 7.7 0 3.2.8 5.8 2.3 7.7 1.7 2.1 4.2 3.2 7.4 3.2 2.9 0 4.9-.8 6.6-2.4 2.2-2.2 2.1-4.9 1.4-6.6-.5-1.2-1.5-2.2-2.9-2.8Zm-5 4.7c-1.1.1-2.2-.4-2.3-1.4 0-.8.5-1.6 2.3-1.7h.6c.7 0 1.3.1 1.9.2-.2 2.4-1.4 2.8-2.5 2.9Z" />
  </svg>
);

const ICONS: Record<string, (p: { size?: number }) => JSX.Element> = {
  Instagram: (p) => <Instagram size={p.size} />,
  YouTube: (p) => <Youtube size={p.size} />,
  LinkedIn: (p) => <Linkedin size={p.size} />,
  Facebook: (p) => <Facebook size={p.size} />,
  X: XMark,
  Threads: ThreadsMark,
};

export function Socials({ className, itemClass }: { className?: string; itemClass?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {SITE.socials.map((s) => {
        const Icon = ICONS[s.name];
        return (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Fanitt on ${s.name}`}
            className={cn('flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-0.5', itemClass)}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}
