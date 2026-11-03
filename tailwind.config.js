/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0E1630', soft: '#3B4463', mute: '#6B7390' },
        paper: '#FFFAF6',
        sand: '#F6EEE7',
        flame: { DEFAULT: '#FF5A1F', deep: '#E8430A', soft: '#FFE6DA' },
        rose: { DEFAULT: '#EC2A78', soft: '#FDE3EE' },
        sun: '#FFB020',
        night: { DEFAULT: '#0A0F24', 2: '#121935', line: '#232B4D' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { page: '1240px' },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseRing: { '0%': { transform: 'scale(.8)', opacity: '.7' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 48s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        pulseRing: 'pulseRing 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};
