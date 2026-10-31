import {
  adjustableClockBrand,
  type AdjustableClockBrand,
} from '../adjustable-clock-brand.js';
import { toDurationMillis } from '../duration.js';
import { formatInstantUtc, toEpochMillis } from '../instant.js';
import type { AdjustableClock, Clock, DurationInput, InstantInput } from '../types.js';

/** @deprecated Use {@link AdjustableClockBrand} */
export type AdjustableClockMarker = AdjustableClockBrand;

/** @deprecated Use {@link AdjustableClock} */
export type AdjustableClockInstance = AdjustableClock;

const hasAdjustableClockBrand = (
  clock: Clock,
): clock is Clock & AdjustableClockBrand =>
  adjustableClockBrand in clock && clock[adjustableClockBrand] === true;

/** Clock whose instant can be changed; does not patch global `Date`. */
export const createAdjustableClock = (
  initialInstant?: InstantInput,
): AdjustableClock => {
  let epochMillis =
    initialInstant === undefined ? Date.now() : toEpochMillis(initialInstant, 'initial instant');

  const fixTo = (instant: InstantInput): void => {
    epochMillis = toEpochMillis(instant, 'instant');
  };

  const adjustableClock = {
    [adjustableClockBrand]: true,

    now: () => new Date(epochMillis),
    millis: () => epochMillis,
    instant: () => formatInstantUtc(epochMillis),
    fixTo,
    travelTo: (instant: InstantInput) => {
      fixTo(instant);
    },
    forward: (duration: DurationInput) => {
      epochMillis += toDurationMillis(duration);
    },
    reset: () => {
      epochMillis = Date.now();
    },
  } satisfies AdjustableClock;

  return adjustableClock;
};

/** Type guard for clocks created with {@link createAdjustableClock}. */
export const isAdjustableClock = (clock: Clock): clock is AdjustableClock =>
  hasAdjustableClockBrand(clock);
