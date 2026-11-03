// File: src/components/Nav.tsx  (fanitt-website)
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogIn, Menu, X } from 'lucide-react';
import { NAV, SITE } from '@/config/site';
import { useAuth } from '@/lib/auth';
import { Logo } from './Logo';
import { DownloadButtons } from './PlayButton';
import { Magnetic } from './motion';
import { cn } from './cn';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { session } = useAuth();
  // After logging in, come back to the page you were on.
  const loginTo = pathname === '/login' ? '/login' : `/login?next=${encodeURIComponent(pathname)}`;
  const firstName = session?.user.name?.trim().split(/\s+/)[0] || 'Account';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={cn(
            'mx-auto flex h-16 max-w-page items-center justify-between rounded-[22px] pl-5 pr-2.5 transition-all duration-500 sm:pl-6',
            scrolled || open
              ? 'border border-ink/[0.06] bg-white/80 shadow-[0_10px_40px_-18px_rgba(14,22,48,0.25)] backdrop-blur-xl'
              : 'border border-transparent bg-transparent',
          )}
        >
          <Logo className="h-7 sm:h-8" />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-4 py-2 text-[14.5px] font-semibold transition-all duration-300',
                    isActive ? 'text-flame' : 'text-ink-soft hover:bg-ink/[0.04] hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-flame" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden rounded-full px-4 py-2.5 text-[14.5px] font-semibold text-ink-soft transition-colors hover:text-ink md:inline-flex"
            >
              Contact
            </Link>
            {session ? (
              <Link
                to="/account"
                className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-ink/10 bg-white/70 pl-1.5 pr-3.5 text-[14.5px] font-semibold text-ink transition-colors hover:border-ink/20"
              >
                {session.user.avatarUrl ? (
                  <img src={session.user.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flame-bg flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-extrabold text-white">{firstName.charAt(0).toUpperCase()}</span>
                )}
                <span className="hidden max-w-[110px] truncate sm:inline">{firstName}</span>
              </Link>
            ) : (
              <Link
                to={loginTo}
                className="inline-flex h-11 items-center gap-1.5 rounded-[14px] border border-ink/10 bg-white/70 px-4 text-[14.5px] font-bold text-ink transition-colors hover:border-ink/20"
              >
                <LogIn size={16} /> Log in
              </Link>
            )}
            <Magnetic className="hidden sm:inline-block">
              <a
                href={SITE.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="flame-bg group relative inline-flex h-11 items-center overflow-hidden rounded-[14px] px-5 text-[14.5px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(255,90,31,0.8)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Download app</span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-ink text-white lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-paper/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-8 pt-28">
              <nav className="flex flex-col">
                {[...NAV, { label: 'Contact', to: '/contact' }, session ? { label: 'My account', to: '/account' } : { label: 'Log in', to: loginTo }].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between border-b border-ink/[0.07] py-4 font-display text-[30px] font-bold tracking-[-0.03em]',
                          isActive ? 'text-flame' : 'text-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="mt-auto">
                <DownloadButtons />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}