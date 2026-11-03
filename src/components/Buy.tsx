// File: src/components/Buy.tsx  (fanitt-website)
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, LogIn, Smartphone } from 'lucide-react';
import { SITE } from '@/config/site';
import { useAuth } from '@/lib/auth';
import { cn } from './cn';

// Shared pieces for the website purchase pages (community, product, live,
// session, FanBox, plans). Clean single-column card on the brand background.

export function BuyPage({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <section className="relative min-h-[80vh] overflow-hidden pb-24 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute -right-32 -top-10 h-[420px] w-[420px] rounded-full bg-flame/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 top-60 h-72 w-72 rounded-full bg-rose/10 blur-[100px]" />
      <div className={cn('page relative mx-auto', wide ? 'max-w-3xl' : 'max-w-xl')}>{children}</div>
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-[28px] border border-ink/[0.06] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(14,22,48,0.35)] sm:p-8', className)}
    >
      {children}
    </motion.div>
  );
}

/** Picture + small label + big title + line under it. */
export function ItemHeader({ image, eyebrow, title, subtitle, round = false }: { image?: string; eyebrow?: string; title: string; subtitle?: ReactNode; round?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      {image ? (
        <img src={image} alt="" className={cn('h-20 w-20 shrink-0 object-cover ring-1 ring-ink/10', round ? 'rounded-full' : 'rounded-2xl')} />
      ) : (
        <div className={cn('flame-bg flex h-20 w-20 shrink-0 items-center justify-center font-display text-3xl font-extrabold text-white', round ? 'rounded-full' : 'rounded-2xl')}>
          {title.trim().charAt(0).toUpperCase() || 'F'}
        </div>
      )}
      <div className="min-w-0">
        {eyebrow && <p className="text-[13px] font-bold uppercase tracking-wider text-flame">{eyebrow}</p>}
        <h1 className="mt-0.5 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">{title}</h1>
        {subtitle && <div className="mt-1 text-[15px] text-ink-soft">{subtitle}</div>}
      </div>
    </div>
  );
}

export function PayButton({ children, busy, disabled, onClick }: { children: ReactNode; busy?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      className="flame-bg flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(255,90,31,0.7)] transition-transform active:scale-[0.99] disabled:opacity-50"
    >
      {busy && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Loading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center text-ink-mute">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="underline">
          Try again
        </button>
      )}
    </div>
  );
}

export function NotAvailable({ what = 'page' }: { what?: string }) {
  return (
    <Card className="text-center">
      <h1 className="font-display text-[26px] font-extrabold">This {what} isn’t available</h1>
      <p className="mt-2 text-ink-soft">It may have been removed or the link is wrong.</p>
      <Link to="/" className="mt-6 inline-block font-bold text-flame">
        Go to Fanitt home
      </Link>
    </Card>
  );
}

/** "Log in to continue" — returns to this page after login. */
export function LoginButton({ label = 'Log in to continue' }: { label?: string }) {
  const location = useLocation();
  const next = encodeURIComponent(location.pathname + location.search);
  return (
    <Link
      to={`/login?next=${next}`}
      className="flame-bg flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(255,90,31,0.7)]"
    >
      <LogIn size={18} /> {label}
    </Link>
  );
}

/** Logged in as … · Not you? */
export function WhoAmI() {
  const { session, logout } = useAuth();
  if (!session) return null;
  return (
    <p className="mt-4 text-center text-[13px] text-ink-mute">
      Logged in as <b className="text-ink-soft">{session.user.email}</b> ·{' '}
      <button type="button" onClick={logout} className="font-semibold text-flame underline-offset-2 hover:underline">
        Not you?
      </button>
    </p>
  );
}

/** After paying: tick + what happens next + get the app. */
export function Done({ title, message }: { title: string; message: string }) {
  return (
    <Card className="text-center">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flame-bg mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] text-white"
      >
        <CheckCircle2 size={38} />
      </motion.span>
      <h1 className="mt-6 font-display text-[30px] font-extrabold">{title}</h1>
      <p className="mx-auto mt-2 max-w-sm text-ink-soft">{message}</p>
      <div className="mt-6 rounded-2xl bg-sand p-4 text-left">
        <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
          <Smartphone size={16} /> Open the Fanitt app
        </p>
        <p className="mt-1 text-[13px] text-ink-soft">Log in with the same email — it’s already unlocked for you.</p>
        <a href={SITE.playStore} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[14px] font-bold text-flame">
          Get Fanitt on Google Play →
        </a>
      </div>
    </Card>
  );
}

/** Small row of facts (date, members, files…). */
export function Facts({ items }: { items: Array<{ icon: ReactNode; text: ReactNode } | false | null | undefined> }) {
  const list = items.filter(Boolean) as Array<{ icon: ReactNode; text: ReactNode }>;
  if (!list.length) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {list.map((f, i) => (
        <li key={i} className="flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-[13px] font-semibold text-ink-soft">
          {f.icon}
          {f.text}
        </li>
      ))}
    </ul>
  );
}