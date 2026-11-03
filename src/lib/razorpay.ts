// File: src/lib/razorpay.ts  (fanitt-website)

// Opens Razorpay Checkout on the website. Resolves with the payment ids, or
// null when the person closes the window.

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (r: unknown) => void) => void };
  }
}

let loading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error('Couldn’t open the payment window. Check your internet and try again.'));
    };
    document.body.appendChild(s);
  });
  return loading;
}

export type RazorpayResult = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
};

export async function payWithRazorpay(options: Record<string, unknown>): Promise<RazorpayResult | null> {
  await loadScript();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      theme: { color: '#F4511E' },
      ...options,
      handler: (r: RazorpayResult) => resolve(r),
      modal: { ondismiss: () => resolve(null) },
    });
    rzp.on('payment.failed', (r: unknown) => {
      const msg = (r as { error?: { description?: string } })?.error?.description;
      reject(new Error(msg || 'Payment failed. No money was taken — please try again.'));
    });
    rzp.open();
  });
}