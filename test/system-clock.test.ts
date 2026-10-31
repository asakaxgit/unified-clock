import { describe, expect, it } from 'vitest';
import { createSystemClock } from '../src/clocks/system-clock.js';

describe('createSystemClock', () => {
  it('returns consistent readings near real time', () => {
    const before = Date.now();
    const clock = createSystemClock();
    const ms = clock.millis();
    const after = Date.now();

    expect(ms).toBeGreaterThanOrEqual(before);
    expect(ms).toBeLessThanOrEqual(after);
    expect(clock.now().getTime()).toBe(ms);
    expect(clock.instant()).toBe(new Date(ms).toISOString());
    expect(clock.instant()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
