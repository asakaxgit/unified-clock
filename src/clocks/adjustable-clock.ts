import { toDurationMillis } from '../duration.js';
import { formatInstantUtc, toEpochMillis } from '../instant.js';
import type { AdjustableClock, DurationInput, InstantInput } from '../types.js';

const ADJUSTABLE = Symbol('unified-clock.adjustable');

export type AdjustableClockMarker = {
  readonly [ADJUSTABLE]: true;
};

export type AdjustableClockInstance = AdjustableClock & AdjustableClockMarker;

/** Clock whose instant can be changed; does not patch global `Date`. */
export const createAdjustableClock = (
  initialInstant?: InstantInput,
): AdjustableClockInstance => {
  let epochMillis =
    initialInstant === undefined ? Date.now() : toEpochMillis(initialInstant, 'initial instant');

  const fixTo = (instant: InstantInput): void => {
    epochMillis = toEpochMillis(instant, 'instant');
  };

  const clock: AdjustableClockInstance = {
    [ADJUSTABLE]: true,

    now: () => new Date(epochMillis),
    millis: () => epochMillis,
    instant: () => formatInstantUtc(epochMillis),
    fixTo,
    travelTo: (instant) => {
      fixTo(instant);
    },
    forward: (duration: DurationInput) => {
      epochMillis += toDurationMillis(duration);
    },
    reset: () => {
      epochMillis = Date.now();
    },
  };

  return clock;
};

/** Type guard for clocks created with {@link createAdjustableClock}. */
export const isAdjustableClock = (clock: unknown): clock is AdjustableClock =>
  typeof clock === 'object' &&
  clock !== null &&
  ADJUSTABLE in clock &&
  (clock as AdjustableClockMarker)[ADJUSTABLE] === true;
