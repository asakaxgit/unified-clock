/** Clock implementation kind (matches quarkus.clock.type). */
export type ClockType = 'system' | 'fixed' | 'adjustable';

/** Partial duration for {@link AdjustableClock.forward}. */
export type DurationParts = {
  readonly days?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly ms?: number;
};

/** Milliseconds or a structured duration object. */
export type DurationInput = number | DurationParts;

/** Injectable time source (analogous to `java.time.Clock`). */
export type Clock = {
  /** Current instant as a `Date` (UTC semantics via {@link Clock.instant}). */
  readonly now: () => Date;
  /** Epoch milliseconds for the current instant. */
  readonly millis: () => number;
  /** Current instant as an ISO-8601 UTC string (e.g. `2000-01-01T00:00:00.000Z`). */
  readonly instant: () => string;
};

/** Clock that can be moved for tests or simulations. */
export type AdjustableClock = Clock & {
  /** Jump the clock to an instant (alias: {@link travelTo}). */
  readonly fixTo: (instant: InstantInput) => void;
  /** Jump the clock to an instant (alias of {@link fixTo}). */
  readonly travelTo: (instant: InstantInput) => void;
  /** Advance the clock by a duration. */
  readonly forward: (duration: DurationInput) => void;
  /** Return the clock to the real current time (`Date.now()`). */
  readonly reset: () => void;
};

export type InstantInput = Date | string | number;

/** Configuration for {@link clockFromConfig} / {@link clockFromEnv}. */
export type ClockConfig = {
  /** One of `system`, `fixed`, or `adjustable` (case-insensitive). */
  readonly type?: string;
  /** ISO-8601 instant; required when `type` is `fixed`. */
  readonly fixedInstant?: string;
};

export const CLOCK_ENV = {
  type: 'CLOCK_TYPE',
  fixedInstant: 'CLOCK_FIXED_INSTANT',
} as const;

export type ClockEnvKeys = typeof CLOCK_ENV;
