import { describe, expect, it } from 'vitest';
import { computePaymentSignature, verifyPaymentSignature } from '../../src/domain/paymentSignature';

describe('computePaymentSignature', () => {
  it('is deterministic for the same inputs', () => {
    const a = computePaymentSignature('secret', 'order_1', 'pay_1');
    const b = computePaymentSignature('secret', 'order_1', 'pay_1');
    expect(a).toBe(b);
  });

  it('produces a 64-character hex string (SHA-256 digest)', () => {
    const sig = computePaymentSignature('secret', 'order_1', 'pay_1');
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes if the secret changes', () => {
    const a = computePaymentSignature('secret-a', 'order_1', 'pay_1');
    const b = computePaymentSignature('secret-b', 'order_1', 'pay_1');
    expect(a).not.toBe(b);
  });

  it('changes if the order id changes', () => {
    const a = computePaymentSignature('secret', 'order_1', 'pay_1');
    const b = computePaymentSignature('secret', 'order_2', 'pay_1');
    expect(a).not.toBe(b);
  });

  it('changes if the payment id changes', () => {
    const a = computePaymentSignature('secret', 'order_1', 'pay_1');
    const b = computePaymentSignature('secret', 'order_1', 'pay_2');
    expect(a).not.toBe(b);
  });
});

describe('verifyPaymentSignature', () => {
  it('accepts a correctly computed signature', () => {
    const signature = computePaymentSignature('secret', 'order_1', 'pay_1');
    expect(verifyPaymentSignature('secret', 'order_1', 'pay_1', signature)).toBe(true);
  });

  it('rejects a signature computed with the wrong secret', () => {
    const signature = computePaymentSignature('wrong-secret', 'order_1', 'pay_1');
    expect(verifyPaymentSignature('secret', 'order_1', 'pay_1', signature)).toBe(false);
  });

  it('rejects a signature for a different order id (tamper attempt)', () => {
    const signature = computePaymentSignature('secret', 'order_1', 'pay_1');
    expect(verifyPaymentSignature('secret', 'order_2', 'pay_1', signature)).toBe(false);
  });

  it('rejects a signature for a different payment id (tamper attempt)', () => {
    const signature = computePaymentSignature('secret', 'order_1', 'pay_1');
    expect(verifyPaymentSignature('secret', 'order_1', 'pay_2', signature)).toBe(false);
  });

  it('rejects a garbage signature without throwing', () => {
    expect(verifyPaymentSignature('secret', 'order_1', 'pay_1', 'not-a-real-signature')).toBe(
      false
    );
  });

  it('rejects an empty signature without throwing', () => {
    expect(verifyPaymentSignature('secret', 'order_1', 'pay_1', '')).toBe(false);
  });
});
