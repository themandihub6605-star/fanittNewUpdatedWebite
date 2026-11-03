// File: src/lib/checkout.ts  (fanitt-website)
import { api, ApiError } from './api';
import { payWithRazorpay } from './razorpay';

// The three ways Fanitt takes money, wrapped so pages just call one function.
// Each returns 'done' (paid / already owned) or 'cancelled' (window closed).

export type PayOutcome = 'done' | 'cancelled';

type StoreStart = {
  order: { _id: string };
  paid: boolean;
  razorpay: { keyId: string; orderId: string; amount: number; currency: string; name: string; description: string; prefill?: Record<string, string> } | null;
};

/** Store orders: digital products, live tickets, FanBox and paid communities. */
export async function payStoreOrder(startPath: string, body: Record<string, unknown> = {}): Promise<PayOutcome> {
  let start: StoreStart;
  try {
    start = (await api<StoreStart>(startPath, { body: { payWith: 'razorpay', ...body } })).data;
  } catch (e) {
    if (e instanceof ApiError && e.code === 'ALREADY_OWNED') return 'done';
    throw e;
  }
  if (start.paid || !start.razorpay) return 'done';
  const r = start.razorpay;
  const result = await payWithRazorpay({
    key: r.keyId,
    order_id: r.orderId,
    amount: r.amount,
    currency: r.currency || 'INR',
    name: r.name || 'Fanitt',
    description: r.description,
    prefill: r.prefill,
  });
  if (!result) return 'cancelled';
  await api(`/store/orders/${start.order._id}/verify`, {
    body: { razorpayOrderId: result.razorpay_order_id, razorpayPaymentId: result.razorpay_payment_id, razorpaySignature: result.razorpay_signature },
  });
  return 'done';
}

/** Creator / brand Pro plans (Razorpay subscription). */
export async function payPlan(planId: string, prefill: Record<string, string>): Promise<PayOutcome> {
  const { data } = await api<{ razorpaySubscriptionId: string; razorpayKeyId: string }>('/subscriptions/checkout', { body: { planId } });
  const result = await payWithRazorpay({
    key: data.razorpayKeyId,
    subscription_id: data.razorpaySubscriptionId,
    name: 'Fanitt',
    description: 'Fanitt plan',
    prefill,
  });
  if (!result) return 'cancelled';
  await api('/subscriptions/verify', {
    body: {
      razorpaySubscriptionId: result.razorpay_subscription_id || data.razorpaySubscriptionId,
      razorpayPaymentId: result.razorpay_payment_id,
      razorpaySignature: result.razorpay_signature,
      planId,
    },
  });
  return 'done';
}

/** Paid live sessions (meets) — booked through /bookings. */
export async function paySession(sessionId: string, keyId: string, title: string, prefill: Record<string, string>): Promise<PayOutcome> {
  let start: { booking: { _id: string }; requiresPayment: boolean; order?: { id: string; amount: number; currency?: string } };
  try {
    start = (await api<typeof start>('/bookings', { body: { sessionId } })).data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) return 'done'; // already booked
    throw e;
  }
  if (!start.requiresPayment || !start.order) return 'done';
  if (!keyId) throw new ApiError('Payments are not set up on this website yet. Please try again later.');
  const result = await payWithRazorpay({
    key: keyId,
    order_id: start.order.id,
    amount: start.order.amount,
    currency: start.order.currency || 'INR',
    name: 'Fanitt',
    description: title,
    prefill,
  });
  if (!result) return 'cancelled';
  await api('/bookings/verify-payment', {
    body: {
      bookingId: start.booking._id,
      razorpayOrderId: result.razorpay_order_id,
      razorpayPaymentId: result.razorpay_payment_id,
      razorpaySignature: result.razorpay_signature,
    },
  });
  return 'done';
}