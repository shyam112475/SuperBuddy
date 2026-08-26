import { describe, expect, it } from 'vitest';
import { createBookingSchema } from '../../src/validators/booking.validators';

function futureDate(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

const validBase = {
  partnerProfileId: '11111111-1111-1111-1111-111111111111',
  offeringId: '22222222-2222-2222-2222-222222222222',
  activityDescription: 'A Saturday morning hike at Sunset Ridge, back by lunch.',
};

describe('createBookingSchema', () => {
  it('accepts a valid booking request', () => {
    const result = createBookingSchema.safeParse({
      body: {
        ...validBase,
        scheduledStart: futureDate(24),
        scheduledEnd: futureDate(26),
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects a scheduledStart in the past', () => {
    const result = createBookingSchema.safeParse({
      body: {
        ...validBase,
        scheduledStart: futureDate(-1),
        scheduledEnd: futureDate(1),
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects scheduledEnd before scheduledStart', () => {
    const result = createBookingSchema.safeParse({
      body: {
        ...validBase,
        scheduledStart: futureDate(24),
        scheduledEnd: futureDate(23),
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a booking longer than 12 hours', () => {
    const result = createBookingSchema.safeParse({
      body: {
        ...validBase,
        scheduledStart: futureDate(24),
        scheduledEnd: futureDate(24 + 13),
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects an activityDescription shorter than 10 characters', () => {
    const result = createBookingSchema.safeParse({
      body: {
        ...validBase,
        activityDescription: 'too short',
        scheduledStart: futureDate(24),
        scheduledEnd: futureDate(26),
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-UUID partnerProfileId', () => {
    const result = createBookingSchema.safeParse({
      body: {
        ...validBase,
        partnerProfileId: 'not-a-uuid',
        scheduledStart: futureDate(24),
        scheduledEnd: futureDate(26),
      },
    });
    expect(result.success).toBe(false);
  });

  it('accepts a booking at exactly the 12-hour boundary', () => {
    const result = createBookingSchema.safeParse({
      body: {
        ...validBase,
        scheduledStart: futureDate(24),
        scheduledEnd: futureDate(36),
      },
    });
    expect(result.success).toBe(true);
  });
});
