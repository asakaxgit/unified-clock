import { describe, expect, it } from 'vitest';
import { createSystemClock } from '../src/clocks/system-clock.js';

describe('createSystemClock', () => {
  it('returns current time within a reasonable window', () => {
    const before = Date.now();
    const clock = createSystemClock();
    const after = Date.now();

    expect(clock.millis()).toBeGreaterThanOrEqual(before);
    expect(clock.millis()).toBeLessThanOrEqual(after);
    expect(clock.now().getTime()).toBe(clock.millis());
    expect(clock.instant()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
