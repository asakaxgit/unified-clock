import { formatInstantUtc, toEpochMillis } from '../instant.js';
import type { Clock, InstantInput } from '../types.js';

/** Clock pinned to a single instant (UTC). */
export const createFixedClock = (instant: InstantInput): Clock => {
  const epochMillis = toEpochMillis(instant, 'fixed instant');

  const fixedClock = {
    now: () => new Date(epochMillis),
    millis: () => epochMillis,
    instant: () => formatInstantUtc(epochMillis),
  } satisfies Clock;

  return fixedClock;
};
