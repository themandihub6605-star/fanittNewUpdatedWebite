import { Link } from 'react-router-dom';
import { usePageTitle } from '@/components/usePageTitle';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame/20 blur-[120px]" />
      <div className="page relative text-center">
        <p className="flame-text font-display text-[120px] font-extrabold leading-none sm:text-[180px]">404</p>
        <h1 className="mt-4 text-[32px] font-extrabold sm:text-[44px]">This page doesn’t exist.</h1>
        <p className="mt-3 text-ink-soft">The link may be old or mistyped.</p>
        <Link to="/" className="mt-8 inline-flex h-12 items-center rounded-2xl bg-ink px-6 text-[15px] font-bold text-white">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
