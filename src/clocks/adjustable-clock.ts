import { toDurationMillis } from '../duration.js';
import { formatInstantUtc, toEpochMillis } from '../instant.js';
import type { AdjustableClock, Clock, DurationInput, InstantInput } from '../types.js';

const ADJUSTABLE = Symbol('unified-clock.adjustable');

export type AdjustableClockMarker = {
  readonly [ADJUSTABLE]: true;
};

export type AdjustableClockInstance = AdjustableClock & AdjustableClockMarker;

const isAdjustableClockMarker = (clock: Clock): clock is AdjustableClockInstance =>
  ADJUSTABLE in clock && Reflect.get(clock, ADJUSTABLE) === true;

/** Clock whose instant can be changed; does not patch global `Date`. */
export const createAdjustableClock = (
  initialInstant?: InstantInput,
): AdjustableClockInstance => {
  let epochMillis =
    initialInstant === undefined ? Date.now() : toEpochMillis(initialInstant, 'initial instant');

  const fixTo = (instant: InstantInput): void => {
    epochMillis = toEpochMillis(instant, 'instant');
  };

  const adjustableClock = {
    [ADJUSTABLE]: true,

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
  } satisfies AdjustableClockInstance;

  return adjustableClock;
};

/** Type guard for clocks created with {@link createAdjustableClock}. */
export const isAdjustableClock = (clock: Clock): clock is AdjustableClock =>
  isAdjustableClockMarker(clock);
