// File: src/config/roles.ts  (fanitt-website)
import { SCREENS, SCROLLS } from './site';

export type RoleKey = 'creators' | 'brands' | 'fans' | 'agencies';

export const ROLES: Record<
  RoleKey,
  {
    label: string;
    title: string;
    line: string;
    screen: string;
    scroll?: { src: string; nav?: string };
    points: { title: string; text: string }[];
  }
> = {
  creators: {
    label: 'Creators',
    title: 'Turn your audience into income',
    line: 'Open your Fanitt Store, sell your time and your work, and get hired by brands — without juggling five apps.',
    screen: SCREENS.home,
    scroll: SCROLLS.home,
    points: [
      { title: 'Paid calls', text: 'Audio and video calls at a per-minute rate you set, or free when you want.' },
      { title: 'Live sessions', text: 'Go live for your followers or your community, free or with a ticket.' },
      { title: 'Digital products & FanBox', text: 'Sell guides, presets and more, and let fans support you directly.' },
      { title: 'Brand campaigns', text: 'Apply to paid and barter campaigns and get paid through escrow.' },
    ],
  },
  brands: {
    label: 'Brands',
    title: 'Hire creators you can trust',
    line: 'Post a campaign, choose from verified creators and pay only when the work is done.',
    screen: SCREENS.campaigns,
    points: [
      { title: 'Post a campaign', text: 'Set the brief, budget, city and how many creators you need.' },
      { title: 'Pick verified creators', text: 'Review profiles, ratings and proposals before you approve anyone.' },
      { title: 'Escrow payments', text: 'Your money is held safely and released when you approve the work.' },
      { title: 'Track milestones', text: 'Follow every deliverable from brief to final post in one place.' },
    ],
  },
  fans: {
    label: 'Fans',
    title: 'Get closer to the creators you follow',
    line: 'Follow, chat, call and join live sessions with creators — and find people who love the same things.',
    screen: SCREENS.feed,
    points: [
      { title: 'Follow & chat', text: 'Message creators and keep up with their posts in your feed.' },
      { title: 'Book a call', text: 'Talk one-on-one at the creator’s own rate, or free when they offer it.' },
      { title: 'Join live sessions', text: 'Watch and take part in live sessions from your phone.' },
      { title: 'Communities', text: 'Join groups around travel, fitness, tech, food and more.' },
    ],
  },
  agencies: {
    label: 'Agencies',
    title: 'Grow with the creators you bring',
    line: 'Get your own referral code, bring creators onto Fanitt and earn as they grow.',
    screen: SCREENS.home,
    points: [
      { title: 'Your referral code', text: 'Share one code with every creator you manage.' },
      { title: 'See who joined', text: 'Track every creator who signed up with your code.' },
      { title: 'Earn commission', text: 'Get a share of earnings from the creators you referred.' },
      { title: 'Verified agency badge', text: 'Show brands and creators that your agency is approved.' },
    ],
  },
};

export const ROLE_PAGES: Record<
  RoleKey,
  {
    headline: string;
    intro: string;
    secondScreen: string;
    steps: { title: string; text: string }[];
    extras: { title: string; text: string }[];
    cta: string;
  }
> = {
  creators: {
    headline: 'Your talent. Your store. Your income.',
    intro: 'Fanitt gives every creator a home for their audience, a store for their time and work, and a direct line to brands that pay.',
    secondScreen: SCREENS.profile,
    steps: [
      { title: 'Sign up as a creator', text: 'Pick your categories and add your social links.' },
      { title: 'Get verified', text: 'Upload your details once. Our team reviews them.' },
      { title: 'Open your Fanitt Store', text: 'Set call rates, schedule lives and add products.' },
      { title: 'Earn and withdraw', text: 'Money lands in your wallet and goes to your bank.' },
    ],
    extras: [
      { title: 'Posts and portfolio', text: 'Share posts and show your best work on your profile.' },
      { title: 'Your own communities', text: 'Start a community and go live just for its members.' },
      { title: 'Refer and earn', text: 'Invite other creators and earn when they join.' },
      { title: 'Plans that grow with you', text: 'Upgrade when you need more proposals and tools.' },
    ],
    cta: 'Start earning on Fanitt.',
  },
  brands: {
    headline: 'Find the right creators. Pay only for work you approve.',
    intro: 'Run influencer campaigns from your phone — from the brief to the final post — with every payment protected by escrow.',
    secondScreen: SCREENS.profile,
    steps: [
      { title: 'Create your brand profile', text: 'Add your company details and get verified.' },
      { title: 'Post a campaign', text: 'Paid, barter or both, with your city and budget.' },
      { title: 'Choose creators', text: 'Compare proposals, profiles and ratings.' },
      { title: 'Approve and release', text: 'Payment leaves escrow only when you approve.' },
    ],
    extras: [
      { title: 'Search creators', text: 'Find creators by name, category and city.' },
      { title: 'Chat with creators', text: 'Talk through the brief before you commit.' },
      { title: 'Milestones', text: 'Split bigger jobs into steps and pay as each one lands.' },
      { title: 'Ratings', text: 'Rate creators after each campaign to help others choose.' },
    ],
    cta: 'Post your first campaign.',
  },
  fans: {
    headline: 'The creators you love, one tap away.',
    intro: 'Follow creators, talk to them, join their live sessions and meet people who share your interests.',
    secondScreen: SCREENS.messages,
    steps: [
      { title: 'Sign up as a fan', text: 'It takes a minute and it is free.' },
      { title: 'Follow creators', text: 'Find them by name or browse by category.' },
      { title: 'Chat, call or join a live', text: 'Free or paid, as the creator sets it.' },
      { title: 'Join communities', text: 'Find your people and talk every day.' },
    ],
    extras: [
      { title: 'Your library', text: 'Everything you buy is saved in one place.' },
      { title: 'Saved posts', text: 'Keep the posts you want to come back to.' },
      { title: 'Shop', text: 'Buy products creators recommend and sell.' },
      { title: 'Safe payments', text: 'Pay with UPI and cards through Razorpay.' },
    ],
    cta: 'Get closer to your favourite creators.',
  },
  agencies: {
    headline: 'Bring your creators. Grow with them.',
    intro: 'Agencies get a referral code, a dashboard of the creators they brought in, and commission on their growth.',
    secondScreen: SCREENS.communities,
    steps: [
      { title: 'Sign up as an agency', text: 'Add your agency details for review.' },
      { title: 'Get your code', text: 'Your referral code appears on your dashboard.' },
      { title: 'Share it with creators', text: 'Creators enter it when they sign up.' },
      { title: 'Track and earn', text: 'See who joined and what you earn.' },
    ],
    extras: [
      { title: 'Recently joined', text: 'A live list of creators who used your code.' },
      { title: 'Earnings view', text: 'Your commission, in one clear screen.' },
      { title: 'Browse brands', text: 'See which brands are active on Fanitt.' },
      { title: 'Verified badge', text: 'Approved agencies get a verified badge.' },
    ],
    cta: 'Start growing with Fanitt.',
  },
};