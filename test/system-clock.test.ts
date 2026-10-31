import { describe, expect, it } from 'vitest';
import { createSystemClock } from '../src/clocks/system-clock.js';

describe('createSystemClock', () => {
  it('reads live time and formats UTC instants', () => {
    const clock = createSystemClock();
    const ms = clock.millis();
    expect(Math.abs(ms - Date.now())).toBeLessThan(100);

    const nowMs = clock.now().getTime();
    expect(Math.abs(nowMs - Date.now())).toBeLessThan(100);

    expect(clock.instant()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(clock.instant()).toBe(new Date(clock.millis()).toISOString());
  });
});
