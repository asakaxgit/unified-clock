import { toDurationMillis } from '../duration.js';
import { formatInstantUtc, toEpochMillis } from '../instant.js';
import type { AdjustableClock, DurationInput, InstantInput } from '../types.js';

const ADJUSTABLE = Symbol('unified-clock.adjustable');

export interface AdjustableClockMarker {
  readonly [ADJUSTABLE]: true;
}

/** Clock whose instant can be changed; does not patch global `Date`. */
export function createAdjustableClock(initialInstant?: InstantInput): AdjustableClock &
  AdjustableClockMarker {
  let epochMillis =
    initialInstant === undefined ? Date.now() : toEpochMillis(initialInstant, 'initial instant');

  const clock: AdjustableClock & AdjustableClockMarker = {
    [ADJUSTABLE]: true,

    now(): Date {
      return new Date(epochMillis);
    },
    millis(): number {
      return epochMillis;
    },
    instant(): string {
      return formatInstantUtc(epochMillis);
    },
    fixTo(instant: InstantInput): void {
      epochMillis = toEpochMillis(instant, 'instant');
    },
    travelTo(instant: InstantInput): void {
      clock.fixTo(instant);
    },
    forward(duration: DurationInput): void {
      epochMillis += toDurationMillis(duration);
    },
    reset(): void {
      epochMillis = Date.now();
    },
  };

  return clock;
}

/** Type guard for clocks created with {@link createAdjustableClock}. */
export function isAdjustableClock(clock: unknown): clock is AdjustableClock {
  return (
    typeof clock === 'object' &&
    clock !== null &&
    ADJUSTABLE in clock &&
    (clock as AdjustableClockMarker)[ADJUSTABLE] === true
  );
}
