import { Link } from 'react-router-dom';

export function Logo({ className = 'h-8' }: { className?: string }) {
  return (
    <Link to="/" aria-label="Fanitt home" className="inline-flex shrink-0 items-center">
      <img src="/logo.png" alt="Fanitt" className={`${className} w-auto`} width={600} height={146} />
    </Link>
  );
}
