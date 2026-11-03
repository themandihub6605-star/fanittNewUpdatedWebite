import { BadgeCheck, Lock, ShieldCheck, Headphones } from 'lucide-react';

const ITEMS = [
  { icon: BadgeCheck, title: 'Verified accounts', text: 'Creators, brands and agencies are reviewed before they get a verified badge.' },
  { icon: ShieldCheck, title: 'Safe payments', text: 'Payments run through Razorpay. Campaign money waits in escrow until work is approved.' },
  { icon: Lock, title: 'Your data stays yours', text: 'We never sell personal data. Card and bank details are handled by our payment partner.' },
  { icon: Headphones, title: 'A real team', text: 'Our team in Bengaluru answers on email and phone.' },
];

export function Trust() {
  return (
    <section className="py-20 lg:py-28">
      <div className="page">
        <h2 className="max-w-2xl text-[38px] font-extrabold leading-[1.02] sm:text-[52px]">Built to be trusted with your money and your name.</h2>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t-2 border-ink pt-6">
              <Icon size={26} className="text-flame" />
              <h3 className="mt-5 font-sans text-[18px] font-bold tracking-[-0.01em]">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
