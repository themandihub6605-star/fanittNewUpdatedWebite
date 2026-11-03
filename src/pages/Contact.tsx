// File: src/pages/Contact.tsx  (fanitt-website)
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { SITE } from '@/config/site';
import { PageHeader } from '@/components/PageHeader';
import { Socials } from '@/components/Socials';
import { cn } from '@/components/cn';
import { usePageTitle } from '@/components/usePageTitle';
import { Reveal, Spotlight } from '@/components/motion';

const ROLES = ['Creator', 'Brand', 'Fan', 'Agency', 'Other'] as const;

const field =
  'h-14 w-full rounded-2xl border border-ink/10 bg-white px-5 text-[16px] text-ink outline-none transition-all placeholder:text-ink-mute/70 focus:border-flame focus:ring-4 focus:ring-flame/10';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

export default function Contact() {
  usePageTitle('Contact', 'Get in touch with the Fanitt team.');
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Creator' as (typeof ROLES)[number], message: '', website: '' });
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      setStatus({ kind: 'error', message: 'Write a little more so we can help — at least 10 characters.' });
      return;
    }
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(`${SITE.apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, name: form.name.trim(), email: form.email.trim(), message: form.message.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || 'Your message couldn’t be sent. Try again, or email us.');
      setStatus({ kind: 'sent' });
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof TypeError ? `Can’t reach Fanitt right now. Email us at ${SITE.email}.` : (err as Error).message,
      });
    }
  };

  return (
    <>
      <PageHeader title="Let’s talk." intro="Questions, feedback, partnerships or help with your account — send a message and our team will reply." />

      <section className="pb-24">
        <div className="page grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          {/* details */}
          <Reveal from="left" className="space-y-4">
            <Spotlight tone="dark" tilt={4} className="rounded-[28px] bg-night p-8 text-white">
              <p className="text-[14px] font-semibold text-white/50">Fanitt is a product of</p>
              <p className="mt-1 font-display text-[26px] font-extrabold tracking-[-0.03em] text-white">{SITE.company}</p>
              <ul className="mt-8 space-y-5">
                <li>
                  <a href={`mailto:${SITE.email}`} className="group flex items-center gap-4">
                    <span className="flame-bg flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110">
                      <Mail size={20} />
                    </span>
                    <span>
                      <span className="block text-[13px] text-white/50">Email</span>
                      <span className="text-[17px] font-bold group-hover:text-flame">{SITE.email}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={SITE.phoneHref} className="group flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Phone size={20} />
                    </span>
                    <span>
                      <span className="block text-[13px] text-white/50">Phone</span>
                      <span className="text-[17px] font-bold group-hover:text-flame">{SITE.phone}</span>
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <MapPin size={20} />
                  </span>
                  <span>
                    <span className="block text-[13px] text-white/50">Office</span>
                    <span className="text-[17px] font-bold">{SITE.city}</span>
                  </span>
                </li>
              </ul>
            </Spotlight>
            <div className="rounded-[28px] bg-sand p-8">
              <p className="text-[15px] font-bold">Follow Fanitt</p>
              <Socials className="mt-4" itemClass="bg-white text-ink hover:bg-flame hover:text-white" />
            </div>
          </Reveal>

          {/* form */}
          <Reveal from="right" className="relative rounded-[32px] border border-ink/[0.06] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(14,22,48,0.35)] sm:p-10">
            <AnimatePresence mode="wait">
              {status.kind === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[460px] flex-col items-center justify-center text-center"
                >
                  <span className="flame-bg flex h-20 w-20 items-center justify-center rounded-[26px] text-white">
                    <CheckCircle2 size={38} />
                  </span>
                  <h2 className="mt-6 text-[32px] font-extrabold">Message sent</h2>
                  <p className="mt-2 max-w-sm text-ink-soft">Thanks, {form.name.split(' ')[0] || 'there'}. Our team will reply to {form.email}.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, message: '' }));
                      setStatus({ kind: 'idle' });
                    }}
                    className="mt-8 h-12 rounded-2xl border border-ink/15 px-6 text-[15px] font-bold"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <h2 className="text-[28px] font-extrabold sm:text-[32px]">Send a message</h2>

                  <div>
                    <span className="mb-2 block text-[14px] font-bold">I am a</span>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => set('role', r)}
                          aria-pressed={form.role === r}
                          className={cn(
                            'h-11 rounded-full px-5 text-[14.5px] font-bold transition-all',
                            form.role === r ? 'flame-bg text-white shadow-[0_8px_18px_-8px_rgba(255,90,31,0.8)]' : 'bg-sand text-ink-soft hover:text-ink',
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[14px] font-bold">Your name</span>
                      <input required maxLength={80} autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" className={field} />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[14px] font-bold">Email</span>
                      <input required type="email" maxLength={120} autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className={field} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[14px] font-bold">
                      Phone <span className="font-medium text-ink-mute">(optional)</span>
                    </span>
                    <input type="tel" maxLength={20} autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/[^\d+\s-]/g, ''))} placeholder="+91" className={field} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[14px] font-bold">Message</span>
                    <textarea
                      required
                      rows={5}
                      maxLength={2000}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="How can we help?"
                      className={cn(field, 'h-auto resize-none py-4 leading-relaxed')}
                    />
                  </label>
                  {/* spam trap — people never see this */}
                  <input tabIndex={-1} autoComplete="off" aria-hidden value={form.website} onChange={(e) => set('website', e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                  {status.kind === 'error' && (
                    <p role="alert" className="rounded-2xl bg-rose-soft px-4 py-3 text-[14.5px] font-medium text-[#B0154F]">
                      {status.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status.kind === 'sending'}
                    className="flame-bg group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl text-[16px] font-bold text-white shadow-[0_16px_30px_-14px_rgba(255,90,31,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-14px_rgba(255,90,31,1)] disabled:opacity-70"
                  >
                    {status.kind === 'sending' && <Loader2 size={18} className="animate-spin" />}
                    {status.kind === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </>
  );
}