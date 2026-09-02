import { useState } from 'react';
import { useCreateOrder, useVerifyPayment } from './hooks';
import { loadRazorpayScript, openRazorpayCheckout } from './razorpayCheckout';
import type { AxiosError } from 'axios';

export function PayForBookingButton({ bookingId }: { bookingId: string }) {
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: verify, isPending: isVerifying, isSuccess, error: verifyError } = useVerifyPayment();

  const [devOrder, setDevOrder] = useState<{ orderId: string } | null>(null);
  const [devPaymentId, setDevPaymentId] = useState('');
  const [devSignature, setDevSignature] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  async function handlePay() {
    setCreateError(null);
    try {
      const { payment, razorpayKeyId } = await createOrder(bookingId);

      if (!razorpayKeyId) {
        // Dev/mock provider — there's no real checkout widget to open.
        // Server logs a sample paymentId/signature for this order; the
        // developer pastes them in below to exercise the verify flow.
        setDevOrder({ orderId: payment.razorpayOrderId });
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setCreateError('Could not load the payment widget. Please try again.');
        return;
      }

      openRazorpayCheckout({
        key: razorpayKeyId,
        amount: Math.round(payment.amount * 100),
        currency: payment.currency,
        order_id: payment.razorpayOrderId,
        name: 'CompanionHub',
        description: 'Booking payment',
        theme: { color: '#d64a35' },
        handler: (response) => {
          verify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
      });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setCreateError(axiosErr.response?.data?.message || 'Could not start payment. Please try again.');
    }
  }

  function submitDevVerify() {
    if (!devOrder) return;
    verify({
      razorpayOrderId: devOrder.orderId,
      razorpayPaymentId: devPaymentId,
      razorpaySignature: devSignature,
    });
  }

  const apiVerifyError = verifyError as AxiosError<{ message: string }> | null;

  if (isSuccess) {
    return <span className="text-sm font-medium text-green-600">Payment complete ✓</span>;
  }

  return (
    <div>
      {!devOrder && (
        <button
          onClick={handlePay}
          disabled={isCreatingOrder}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isCreatingOrder ? 'Starting…' : 'Pay now'}
        </button>
      )}

      {createError && <p className="mt-1 text-xs text-red-600">{createError}</p>}

      {devOrder && (
        <div className="mt-2 max-w-sm rounded-md border border-amber-200 bg-amber-50 p-3 text-xs">
          <p className="font-medium text-amber-800">Dev mode — no real payment gateway configured</p>
          <p className="mt-1 text-amber-700">
            Check the backend server logs for a sample payment id and signature for order{' '}
            <code className="rounded bg-amber-100 px-1">{devOrder.orderId}</code>, then paste them
            below to simulate a completed payment.
          </p>
          <input
            type="text"
            placeholder="razorpay_payment_id"
            value={devPaymentId}
            onChange={(e) => setDevPaymentId(e.target.value)}
            className="mt-2 w-full rounded-md border border-amber-300 px-2 py-1 text-xs"
          />
          <input
            type="text"
            placeholder="razorpay_signature"
            value={devSignature}
            onChange={(e) => setDevSignature(e.target.value)}
            className="mt-2 w-full rounded-md border border-amber-300 px-2 py-1 text-xs"
          />
          <button
            onClick={submitDevVerify}
            disabled={isVerifying || !devPaymentId || !devSignature}
            className="mt-2 rounded-md bg-amber-700 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {isVerifying ? 'Verifying…' : 'Verify (dev)'}
          </button>
        </div>
      )}

      {apiVerifyError && (
        <p className="mt-1 text-xs text-red-600">
          {apiVerifyError.response?.data?.message || 'Payment verification failed.'}
        </p>
      )}
    </div>
  );
}
