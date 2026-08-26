import { describe, expect, it } from 'vitest';
import { canTransitionBooking, resolveBookingActor } from '../../src/domain/bookingStateMachine';

describe('resolveBookingActor', () => {
  const booking = { userId: 'customer-1', partnerUserId: 'partner-1' };

  it('identifies the customer', () => {
    expect(resolveBookingActor(booking, 'customer-1')).toBe('CUSTOMER');
  });

  it('identifies the partner', () => {
    expect(resolveBookingActor(booking, 'partner-1')).toBe('PARTNER');
  });

  it('returns null for an unrelated user', () => {
    expect(resolveBookingActor(booking, 'stranger-1')).toBeNull();
  });
});

describe('canTransitionBooking', () => {
  // Every transition the spec explicitly allows (Master Development Prompt §19).
  const allowed: Array<[string, string, 'CUSTOMER' | 'PARTNER']> = [
    ['PENDING', 'ACCEPTED', 'PARTNER'],
    ['PENDING', 'REJECTED', 'PARTNER'],
    ['PENDING', 'CANCELLED', 'CUSTOMER'],
    ['ACCEPTED', 'COMPLETED', 'PARTNER'],
    ['ACCEPTED', 'CANCELLED', 'CUSTOMER'],
    ['ACCEPTED', 'CANCELLED', 'PARTNER'],
  ];

  it.each(allowed)('allows %s -> %s by %s', (from, to, actor) => {
    expect(canTransitionBooking(from as never, to as never, actor)).toBe(true);
  });

  // The specific "wrong actor" cases the spec cares about most.
  it('does not allow the customer to accept their own booking', () => {
    expect(canTransitionBooking('PENDING', 'ACCEPTED', 'CUSTOMER')).toBe(false);
  });

  it('does not allow the customer to reject a booking', () => {
    expect(canTransitionBooking('PENDING', 'REJECTED', 'CUSTOMER')).toBe(false);
  });

  it('does not allow the partner to cancel a pending booking', () => {
    expect(canTransitionBooking('PENDING', 'CANCELLED', 'PARTNER')).toBe(false);
  });

  it('does not allow the customer to mark a booking completed', () => {
    expect(canTransitionBooking('ACCEPTED', 'COMPLETED', 'CUSTOMER')).toBe(false);
  });

  // Terminal states have no outgoing transitions at all.
  const terminalStates = ['REJECTED', 'CANCELLED', 'COMPLETED'] as const;
  const allStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'] as const;

  it.each(terminalStates)('%s has no outgoing transitions for either actor', (from) => {
    for (const to of allStatuses) {
      expect(canTransitionBooking(from, to, 'CUSTOMER')).toBe(false);
      expect(canTransitionBooking(from, to, 'PARTNER')).toBe(false);
    }
  });

  it('rejects a made-up transition that was never listed', () => {
    expect(canTransitionBooking('PENDING', 'COMPLETED', 'PARTNER')).toBe(false);
  });
});
