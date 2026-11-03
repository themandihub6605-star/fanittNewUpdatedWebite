// File: src/components/Footer.tsx  (fanitt-website)
import { useRef, type PointerEvent as RPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { SITE } from '@/config/site';
import { DownloadButtons } from './PlayButton';
import { LEGAL_ROUTES, useLegalList } from './useLegal';
import { Socials } from './Socials';
import { Curve, Magnetic, Reveal } from './motion';

const COLUMNS = [
  {
    title: 'Fanitt for',
    links: [
      { label: 'Creators', to: '/creators' },
      { label: 'Brands', to: '/brands' },
      { label: 'Fans', to: '/fans' },
      { label: 'Agencies', to: '/agencies' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
];

/** A footer link: slides right, turns white, and an arrow appears. */
function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-white/65 transition-colors duration-300 hover:text-white">
      <span className="relative transition-transform duration-300 group-hover:translate-x-1">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 rounded bg-gradient-to-r from-flame to-rose transition-transform duration-500 group-hover:scale-x-100" />
      </span>
      <ArrowUpRight size={14} className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-flame" />
    </Link>
  );
}

/**
 * The giant "fanitt" word at the very bottom. It sits in outline; a warm
 * light follows the pointer and fills the letters where it passes.
 */
function BigWord() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const fill = useMotionTemplate`radial-gradient(420px circle at ${sx}% ${sy}%, #FFB020 0%, #FF5A1F 30%, #EC2A78 55%, rgba(236,42,120,0) 75%)`;

  // Rises in as it scrolls into view.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ['0.06em', '-0.045em']);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const word = 'text-center font-display font-extrabold lowercase leading-[0.9] text-[22vw] sm:text-[17vw] lg:text-[15vw] min-[1500px]:text-[220px]';

  return (
    <div ref={ref} onPointerMove={onMove} aria-hidden className="relative select-none overflow-hidden pb-8 pt-10 sm:pb-12">
      <motion.div style={{ y }} className="relative">
        {/* outline */}
        <motion.p style={{ letterSpacing, WebkitTextStroke: '1.5px rgba(255,255,255,0.14)' }} className={`${word} text-transparent`}>
          fanitt
        </motion.p>
        {/* the light that fills the letters */}
        <motion.p
          style={{ letterSpacing, backgroundImage: fill, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
          className={`${word} absolute inset-0 text-transparent`}
        >
          fanitt
        </motion.p>
      </motion.div>
    </div>
  );
}

export function Footer() {
  const legal = useLegalList();
  // Live list from the backend; Privacy and Terms always show.
  const legalLinks = legal.length
    ? legal.map((l) => ({ label: l.title, to: LEGAL_ROUTES[l.slug] || `/legal/${l.slug}` }))
    : [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Use', to: '/terms' },
      ];
  const columns = [...COLUMNS, { title: 'Legal', links: legalLinks }];

  return (
    <footer className="relative text-white">
      <Curve fill="#0A0F24" className="-mb-px" />
      <div className="relative overflow-hidden bg-night">
        {/* drifting colour light */}
        <motion.div
          aria-hidden
          animate={{ x: [0, 80, -40, 0], y: [0, 30, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-[10%] top-32 h-[420px] w-[620px] rounded-full bg-flame/15 blur-[140px]"
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, -60, 30, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute right-[5%] top-[40%] h-[380px] w-[520px] rounded-full bg-rose/15 blur-[140px]"
        />
        {/* fine dot texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 60%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 60%, transparent)',
          }}
        />

        <div className="page relative pt-14 sm:pt-20">
          {/* ---- top: big invite + download ---- */}
          <Reveal from="blur">
            <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-[15px] font-semibold text-white/50">Got a question, an idea or a brand to grow?</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="group mt-3 inline-flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-[40px] font-extrabold leading-[1] tracking-[-0.04em] sm:text-[60px] lg:text-[72px]"
                >
                  <span className="relative">
                    <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent transition-all duration-500 group-hover:from-[#FFB020] group-hover:via-flame group-hover:to-rose">
                      Let’s talk.
                    </span>
                    <span className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-flame to-rose transition-transform duration-700 group-hover:scale-x-100" />
                  </span>
                  <span className="flame-bg flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_16px_40px_-12px_rgba(255,90,31,0.9)] transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110 sm:h-[68px] sm:w-[68px]">
                    <ArrowUpRight size={30} />
                  </span>
                </a>
                <p className="mt-4 text-[15px] text-white/55">{SITE.email}</p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                <p className="font-display text-[22px] font-extrabold tracking-[-0.03em]">Get the Fanitt app</p>
                <p className="mt-1 text-[14px] text-white/55">Free on Android. iPhone app coming soon.</p>
                <DownloadButtons tone="light" className="mt-5" />
              </div>
            </div>
          </Reveal>

          {/* gradient divider that draws in */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 h-px origin-left bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />

          {/* ---- middle: brand + links ---- */}
          <div className="grid gap-12 py-14 lg:grid-cols-[1.1fr_2fr]">
            <Reveal>
              <span className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-[0_14px_30px_-14px_rgba(255,90,31,0.6)]">
                <img src="/logo.png" alt="Fanitt" className="h-8 w-auto" />
              </span>
              <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/55">
                One app for India&apos;s creators, the brands that hire them and the fans who follow them.
              </p>
              <Socials className="mt-7" itemClass="border border-white/10 bg-white/[0.04] text-white/70 hover:scale-110 hover:border-transparent hover:bg-gradient-to-br hover:from-flame hover:to-rose hover:text-white hover:shadow-[0_10px_24px_-8px_rgba(255,90,31,0.8)]" />
            </Reveal>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[1fr_1fr_1fr_1.5fr]">
              {columns.map((col, i) => (
                <Reveal key={col.title} delay={0.06 * i}>
                  <p className="text-[12.5px] font-bold text-white/35">{col.title}</p>
                  <ul className="mt-5 space-y-3.5">
                    {col.links.map((l) => (
                      <li key={l.to}>
                        <FooterLink to={l.to}>{l.label}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
              <Reveal delay={0.2} className="col-span-2 sm:col-span-1">
                <p className="text-[12.5px] font-bold text-white/35">Reach us</p>
                <ul className="mt-5 space-y-3">
                  {[
                    { icon: Mail, text: SITE.email, href: `mailto:${SITE.email}` },
                    { icon: Phone, text: SITE.phone, href: SITE.phoneHref },
                    { icon: MapPin, text: SITE.city },
                  ].map(({ icon: Icon, text, href }) => {
                    const inner = (
                      <>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-flame ring-1 ring-white/10 transition-all duration-300 group-hover:bg-flame group-hover:text-white">
                          <Icon size={15} />
                        </span>
                        <span className="whitespace-nowrap text-[14.5px] font-medium text-white/70 transition-colors group-hover:text-white">{text}</span>
                      </>
                    );
                    return (
                      <li key={text}>
                        {href ? (
                          <a href={href} className="group flex items-center gap-3">
                            {inner}
                          </a>
                        ) : (
                          <span className="group flex items-center gap-3">{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </div>
          </div>

          {/* ---- bottom bar ---- */}
          <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="text-[13px] text-white/40">
              © {new Date().getFullYear()} {SITE.company}. Fanitt is a product of {SITE.company}.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-[13px] font-medium text-white/50">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Made in India
              </span>
              <Magnetic>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] pl-4 pr-1.5 text-[13.5px] font-bold text-white transition-colors hover:border-flame/60"
                >
                  Back to top
                  <span className="flame-bg flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:-translate-y-0.5">
                    <ArrowUp size={15} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
                  </span>
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        <BigWord />
      </div>
    </footer>
  );
}