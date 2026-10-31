import { formatInstantUtc } from '../instant.js';
import type { Clock } from '../types.js';

/** Real-time clock backed by the system (UTC for {@link Clock.instant}). */
export const createSystemClock = (): Clock => {
  const systemClock = {
    now: () => new Date(),
    millis: () => Date.now(),
    instant: () => formatInstantUtc(Date.now()),
  } satisfies Clock;

  return systemClock;
};
