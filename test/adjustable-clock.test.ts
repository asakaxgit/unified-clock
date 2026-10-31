import { describe, expect, it } from 'vitest';
import {
  createAdjustableClock,
  isAdjustableClock,
} from '../src/clocks/adjustable-clock.js';
import { createSystemClock } from '../src/clocks/system-clock.js';

const Y2K = '2000-01-01T00:00:00.000Z';

describe('createAdjustableClock', () => {
  it('starts at real time when no initial instant is given', () => {
    const before = Date.now();
    const clock = createAdjustableClock();
    const after = Date.now();
    expect(clock.millis()).toBeGreaterThanOrEqual(before);
    expect(clock.millis()).toBeLessThanOrEqual(after);
    expect(clock.now().getTime()).toBe(clock.millis());
  });

  it('fixTo and travelTo jump to an instant', () => {
    const clock = createAdjustableClock(Y2K);
    expect(clock.instant()).toBe(Y2K);

    clock.travelTo('2010-06-15T12:30:00Z');
    expect(clock.instant()).toBe('2010-06-15T12:30:00.000Z');

    clock.fixTo(Y2K);
    expect(clock.instant()).toBe(Y2K);
  });

  it('forward advances by milliseconds or duration parts', () => {
    const clock = createAdjustableClock(Y2K);
    clock.forward(1_000);
    expect(clock.instant()).toBe('2000-01-01T00:00:01.000Z');

    clock.fixTo(Y2K);
    clock.forward({ days: 1, hours: 2, minutes: 3, seconds: 4, ms: 5 });
    expect(clock.millis()).toBe(
      Date.parse(Y2K) +
        ((1 * 86_400 + 2 * 3_600 + 3 * 60 + 4) * 1_000 + 5),
    );
  });

  it('reset returns to real time', () => {
    const clock = createAdjustableClock(Y2K);
    const before = Date.now();
    clock.reset();
    const after = Date.now();
    expect(clock.millis()).toBeGreaterThanOrEqual(before);
    expect(clock.millis()).toBeLessThanOrEqual(after);
  });

  it('isAdjustableClock identifies adjustable instances', () => {
    expect(isAdjustableClock(createAdjustableClock())).toBe(true);
    expect(isAdjustableClock(createSystemClock())).toBe(false);
  });

  it('rejects negative forward duration', () => {
    const clock = createAdjustableClock(Y2K);
    expect(() => clock.forward(-1)).toThrow(/non-negative/);
  });
});
