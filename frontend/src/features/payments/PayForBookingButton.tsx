import { useState } from 'react';
import { useCreateOrder, useVerifyPayment } from './hooks';
import { loadRazorpayScript, openRazorpayCheckout } from './razorpayCheckout';
import type { AxiosError } from 'axios';

export function PayForBookingButton({ bookingId }: { bookingId: string }) {
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const {
    mutate: verify,
    isPending: isVerifying,
    isSuccess,
    error: verifyError,
  } = useVerifyPayment();

  const [devOrder, setDevOrder] = useState<{ orderId: string } | null>(null);
  const [devPaymentId, setDevPaymentId] = useState('');
  const [devSignature, setDevSignature] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  async function handlePay() {
    setCreateError(null);

    try {
      const { payment, razorpayKeyId } = await createOrder(bookingId);

      if (!razorpayKeyId) {
        setDevOrder({ orderId: payment.razorpayOrderId });
        return;
      }

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        setCreateError(
          'Could not load the payment gateway. Please check your connection and try again.'
        );
        return;
      }

      openRazorpayCheckout({
        key: razorpayKeyId,
        amount: Math.round(payment.amount * 100),
        currency: payment.currency,
        order_id: payment.razorpayOrderId,
        name: 'SuperBuddy',
        description: 'Companion booking payment',
        theme: {
          color: '#d64a35',
        },
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

      setCreateError(
        axiosErr.response?.data?.message ||
          'Could not start the payment. Please try again.'
      );
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

  const apiVerifyError =
    verifyError as AxiosError<{ message: string }> | null;

  // ─────────────────────────────────────────────
  // SUCCESS
  // ─────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12.5l4 4L19 7.5"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-green-900">
              Payment successful
            </p>
            <p className="mt-0.5 text-xs text-green-700">
              Your booking payment has been confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // DEV PAYMENT
  // ─────────────────────────────────────────────

  if (devOrder) {
    return (
      <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <svg
                className="h-4 w-4 text-amber-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.9L2.9 17a2 2 0 001.75 3h14.7a2 2 0 001.75-3L13.7 3.9a2 2 0 00-3.4 0z"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Developer payment mode
              </p>
              <p className="text-xs text-amber-700">
                Razorpay is not configured yet.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="rounded-lg bg-neutral-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              Order ID
            </p>

            <code className="mt-1 block break-all text-xs text-neutral-800">
              {devOrder.orderId}
            </code>
          </div>

          <p className="text-xs leading-5 text-neutral-600">
            Check the backend logs for the sample payment ID and signature,
            then enter them below to simulate a successful payment.
          </p>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Razorpay payment ID"
              value={devPaymentId}
              onChange={(e) => setDevPaymentId(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />

            <input
              type="text"
              placeholder="Razorpay signature"
              value={devSignature}
              onChange={(e) => setDevSignature(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            onClick={submitDevVerify}
            disabled={
              isVerifying ||
              !devPaymentId.trim() ||
              !devSignature.trim()
            }
            className="w-full rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVerifying ? 'Verifying payment…' : 'Verify test payment'}
          </button>

          {apiVerifyError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <p className="text-xs font-medium text-red-700">
                {apiVerifyError.response?.data?.message ||
                  'Payment verification failed.'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // NORMAL PAYMENT
  // ─────────────────────────────────────────────

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
            <svg
              className="h-5 w-5 text-brand-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />
              <path
                strokeLinecap="round"
                d="M3 10h18"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-neutral-900">
              Complete payment
            </h3>

            <p className="mt-0.5 text-xs leading-5 text-neutral-500">
              Secure your booking by completing the payment.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-neutral-50 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Secure payment
            </span>

            <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Protected
            </span>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={isCreatingOrder}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreatingOrder ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="3"
                />
                <path
                  d="M21 12a9 9 0 00-9-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              Starting secure checkout…
            </>
          ) : (
            <>
              Pay securely

              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6l6 6-6 6"
                />
              </svg>
            </>
          )}
        </button>

        {createError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <div className="flex gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  d="M12 8v4m0 4h.01"
                />
              </svg>

              <p className="text-xs leading-5 text-red-700">
                {createError}
              </p>
            </div>
          </div>
        )}

        {apiVerifyError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-xs leading-5 text-red-700">
              {apiVerifyError.response?.data?.message ||
                'Payment verification failed. Please contact support if money was deducted.'}
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect
              x="5"
              y="11"
              width="14"
              height="10"
              rx="2"
            />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>

          Payments are securely processed
        </div>
      </div>
    </div>
  );
}