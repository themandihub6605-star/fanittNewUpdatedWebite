// File: src/sections/HeroBackdrop.tsx  (fanitt-website)
import { motion } from 'framer-motion';
import { Gift, Heart, Mic, Star, Video } from 'lucide-react';

/**
 * The scene behind the hero phones: drifting colour blobs, a slowly turning
 * gradient ring, two orbits with little icons travelling on them, and a few
 * twinkling sparks.
 */

const BLOBS = [
  { c: '#FF5A1F', size: '70%', x: ['-8%', '10%', '-4%', '-8%'], y: ['-6%', '6%', '12%', '-6%'], top: '6%', left: '10%', d: 18 },
  { c: '#EC2A78', size: '60%', x: ['8%', '-10%', '4%', '8%'], y: ['10%', '-4%', '-10%', '10%'], top: '30%', left: '38%', d: 22 },
  { c: '#FFB020', size: '46%', x: ['0%', '12%', '-8%', '0%'], y: ['0%', '-10%', '8%', '0%'], top: '48%', left: '6%', d: 20 },
];

function OrbitIcon({ icon: Icon, angle, dur, tint }: { icon: typeof Heart; angle: number; dur: number; tint: string }) {
  // The full-size layer turns around the orbit's centre; the icon sits on its
  // top edge and turns the other way so it stays upright.
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ rotate: angle }}
      animate={{ rotate: angle + 360 }}
      transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
    >
      <motion.div
        className="absolute left-1/2 top-0 h-0 w-0"
        initial={{ rotate: -angle }}
        animate={{ rotate: -angle - 360 }}
        transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/70 bg-white/85 shadow-[0_14px_30px_-12px_rgba(14,22,48,0.45)] backdrop-blur-md sm:h-12 sm:w-12"
          style={{ color: tint }}
        >
          <Icon size={19} strokeWidth={2.2} />
        </span>
      </motion.div>
    </motion.div>
  );
}

const SPARKS = [
  { top: '8%', left: '22%', s: 6, d: 0 },
  { top: '18%', left: '86%', s: 4, d: 0.8 },
  { top: '72%', left: '92%', s: 5, d: 1.6 },
  { top: '88%', left: '30%', s: 4, d: 2.2 },
  { top: '40%', left: '2%', s: 5, d: 1.1 },
  { top: '60%', left: '58%', s: 3, d: 2.8 },
];

export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-[-14%] sm:inset-[-12%]">
      {/* drifting colour */}
      {BLOBS.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full opacity-[0.75] blur-[48px]"
          style={{ background: b.c, width: b.size, height: b.size, top: b.top, left: b.left }}
          animate={{ x: b.x, y: b.y, scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* turning gradient ring */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[84%] -translate-x-1/2 -translate-y-1/2">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #FF5A1F, #FFB020, #EC2A78, rgba(255,90,31,0) 70%, #FF5A1F)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* soft glass disc inside the ring */}
      <span className="absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/60 via-white/10 to-white/0 shadow-[inset_0_0_60px_rgba(255,255,255,0.6),0_0_80px_-10px_rgba(255,90,31,0.45)] ring-1 ring-white/70 backdrop-blur-[2px]" />

      {/* dashed orbits */}
      <span className="absolute left-1/2 top-1/2 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-flame/30" />
      <span className="absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-rose/20" />

      {/* icons travelling on the outer orbit (radius = half of 94%) */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0">
          <OrbitIcon icon={Heart} angle={200} dur={40} tint="#EC2A78" />
          <OrbitIcon icon={Star} angle={320} dur={40} tint="#FFB020" />
          <OrbitIcon icon={Gift} angle={80} dur={40} tint="#FF5A1F" />
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0">
          <OrbitIcon icon={Mic} angle={140} dur={28} tint="#0E1630" />
          <OrbitIcon icon={Video} angle={20} dur={28} tint="#FF5A1F" />
        </div>
      </div>

      {/* sparks */}
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,176,32,0.8)]"
          style={{ top: s.top, left: s.left, width: s.s, height: s.s }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2.6, delay: s.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}