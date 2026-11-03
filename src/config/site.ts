// File: src/config/site.ts  (fanitt-website)
// Everything the site says about the company lives here.
export const SITE = {
  name: 'Fanitt',
  company: 'Rago VRadicals LLP',
  email: 'info@fanitt.com',
  phone: '+91 92014 69274',
  phoneHref: 'tel:+919201469274',
  city: 'Bengaluru, Karnataka',
  playStore: 'https://play.google.com/store/apps/details?id=fanitt.comapp.fanittapp',
  // Contact form posts here (backend → saved for the admin panel).
  apiBase: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://api.fanitt.com/api',
  // Public Razorpay key (rzp_live_…) — only needed for paid live-session bookings on the website.
  razorpayKey: (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ?? '',
  socials: [
    { name: 'Instagram', href: 'https://www.instagram.com/fanitt.live/' },
    { name: 'YouTube', href: 'https://www.youtube.com/@FanittLive' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/142918157' },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591263694235' },
    { name: 'X', href: 'https://x.com/fanittlive' },
    { name: 'Threads', href: 'https://www.threads.com/@fanitt.live' },
  ],
} as const;

export const SCREENS = {
  home: '/screens/home.webp',
  feed: '/screens/feed.webp',
  communities: '/screens/communities.webp',
  campaigns: '/screens/campaigns.webp',
  profile: '/screens/profile.webp',
  messages: '/screens/messages.webp',
} as const;

/** Tall screenshots that scroll inside the phone, with the app's bottom bar. */
export const SCROLLS = {
  home: { src: '/screens/home-long.webp', nav: '/screens/home-nav.webp' },
} as const;

export const NAV = [
  { label: 'Creators', to: '/creators' },
  { label: 'Brands', to: '/brands' },
  { label: 'Fans', to: '/fans' },
  { label: 'Agencies', to: '/agencies' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
] as const;