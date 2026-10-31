import { describe, expect, it } from 'vitest';
import { createFixedClock } from '../src/clocks/fixed-clock.js';

const Y2K = '2000-01-01T00:00:00.000Z';

describe('createFixedClock', () => {
  it('pins time to an ISO instant string', () => {
    const clock = createFixedClock(Y2K);
    expect(clock.instant()).toBe(Y2K);
    expect(clock.millis()).toBe(Date.parse(Y2K));
    expect(clock.now().toISOString()).toBe(Y2K);
  });

  it('accepts epoch milliseconds and Date', () => {
    const ms = Date.parse(Y2K);
    expect(createFixedClock(ms).instant()).toBe(Y2K);
    expect(createFixedClock(new Date(ms)).instant()).toBe(Y2K);
  });

  it('caches the ISO instant string across calls', () => {
    const clock = createFixedClock(Y2K);
    const first = clock.instant();
    const second = clock.instant();
    expect(first).toBe(second);
    expect(first).toBe(Y2K);
  });
});
