import { formatInstantUtc } from '../instant.js';
import type { Clock } from '../types.js';

/** Real-time clock backed by the system (UTC for {@link Clock.instant}). */
export function createSystemClock(): Clock {
  return {
    now(): Date {
      return new Date();
    },
    millis(): number {
      return Date.now();
    },
    instant(): string {
      return formatInstantUtc(Date.now());
    },
  };
}
