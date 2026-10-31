import { formatInstantUtc, toEpochMillis } from '../instant.js';
import type { Clock, InstantInput } from '../types.js';

/** Clock pinned to a single instant (UTC). */
export function createFixedClock(instant: InstantInput): Clock {
  const epochMillis = toEpochMillis(instant, 'fixed instant');

  return {
    now(): Date {
      return new Date(epochMillis);
    },
    millis(): number {
      return epochMillis;
    },
    instant(): string {
      return formatInstantUtc(epochMillis);
    },
  };
}
