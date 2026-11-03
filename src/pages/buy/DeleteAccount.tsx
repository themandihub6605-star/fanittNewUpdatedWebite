// File: src/pages/buy/DeleteAccount.tsx  (fanitt-website)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api, writeSession } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { usePageTitle } from '@/components/usePageTitle';
import { BuyPage, Card, ErrorBox, LoginButton, WhoAmI } from '@/components/Buy';
import { SITE } from '@/config/site';

const field =
  'w-full rounded-2xl border border-ink/10 bg-white px-5 py-3 text-[16px] text-ink outline-none transition-all placeholder:text-ink-mute/70 focus:border-flame focus:ring-4 focus:ring-flame/10';

/**
 * fanitt.com/delete-account — delete your Fanitt account from the web
 * (Google Play asks for this link). Same request as "Delete account" in the app.
 */
export default function DeleteAccount() {
  usePageTitle('Delete your account', 'Delete your Fanitt account and personal data.');
  const { session } = useAuth();
  const [reason, setReason] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      await api('/users/me', { method: 'DELETE', body: { reason: reason.trim() } });
      writeSession(null);
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BuyPage>
      <Card>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Trash2 size={24} />
        </span>
        {done ? (
          <>
            <h1 className="mt-5 font-display text-[30px] font-extrabold leading-tight">Request received</h1>
            <p className="mt-2 text-ink-soft">
              Your Fanitt account is locked and will be permanently deleted within 7 days. We’ve sent a confirmation email. If you didn’t mean to do this, write to{' '}
              <a href={`mailto:${SITE.email}`} className="font-bold text-flame">{SITE.email}</a> right away.
            </p>
            <Link to="/" className="mt-6 inline-block font-bold text-flame">Go to Fanitt home</Link>
          </>
        ) : (
          <>
            <h1 className="mt-5 font-display text-[30px] font-extrabold leading-tight">Delete your Fanitt account</h1>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] text-ink-soft">
              <li>Your account is locked right away and permanently deleted within 7 days.</li>
              <li>Your name, email, phone, photo, posts, stories and community posts are removed.</li>
              <li>Payment and invoice records are kept only as long as the law requires.</li>
              <li>Withdraw any wallet balance first — it can’t be recovered after deletion.</li>
              <li>You can also do this in the app: Account → Delete account.</li>
            </ul>

            {!session ? (
              <div className="mt-6">
                <LoginButton label="Log in to delete your account" />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <textarea value={reason} onChange={(e) => setReason(e.target.value.slice(0, 500))} rows={3} placeholder="Why are you leaving? (optional)" className={field} />
                <div>
                  <label className="mb-1.5 block text-[14px] font-bold text-ink">Type DELETE to confirm</label>
                  <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`${field} h-14 py-0`} autoCapitalize="characters" />
                </div>
                {error && <ErrorBox message={error} />}
                <button
                  type="button"
                  disabled={busy || confirm.trim().toUpperCase() !== 'DELETE'}
                  onClick={submit}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-red-600 text-[16px] font-extrabold text-white transition-colors hover:bg-red-700 disabled:opacity-40"
                >
                  {busy ? 'Deleting…' : 'Delete my account'}
                </button>
                <WhoAmI />
              </div>
            )}
          </>
        )}
      </Card>
    </BuyPage>
  );
}