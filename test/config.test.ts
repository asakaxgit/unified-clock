import { describe, expect, it } from 'vitest';
import { clockFromConfig, clockFromEnv } from '../src/config.js';
import { isAdjustableClock } from '../src/clocks/adjustable-clock.js';

const Y2K = '2000-01-01T00:00:00Z';

describe('clockFromConfig', () => {
  it('defaults to system', () => {
    const clock = clockFromConfig({});
    const before = Date.now();
    expect(clock.millis()).toBeGreaterThanOrEqual(before - 10);
  });

  it('creates fixed clock with validated instant', () => {
    const clock = clockFromConfig({ type: 'FIXED', fixedInstant: Y2K });
    expect(clock.instant()).toBe('2000-01-01T00:00:00.000Z');
  });

  it('creates adjustable clock', () => {
    expect(isAdjustableClock(clockFromConfig({ type: 'adjustable' }))).toBe(true);
  });

  it('throws on invalid type', () => {
    expect(() => clockFromConfig({ type: 'warp' })).toThrow(/invalid clock type/i);
    expect(() => clockFromEnv({ CLOCK_TYPE: 'invalid' })).toThrow(/invalid clock type/i);
  });

  it('throws when fixed instant missing or invalid', () => {
    expect(() => clockFromConfig({ type: 'fixed' })).toThrow(/required/i);
    expect(() =>
      clockFromConfig({ type: 'fixed', fixedInstant: 'yesterday' }),
    ).toThrow(/invalid fixed instant/i);
  });
});

describe('clockFromEnv', () => {
  it('reads CLOCK_TYPE and CLOCK_FIXED_INSTANT', () => {
    const clock = clockFromEnv({
      CLOCK_TYPE: 'fixed',
      CLOCK_FIXED_INSTANT: Y2K,
    });
    expect(clock.instant()).toBe('2000-01-01T00:00:00.000Z');
  });

  it('treats empty CLOCK_TYPE as system', () => {
    const clock = clockFromEnv({ CLOCK_TYPE: '' });
    expect(clock.millis()).toBeLessThanOrEqual(Date.now());
  });
});
