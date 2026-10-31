/** Clock implementation kind (matches quarkus.clock.type). */
export type ClockType = 'system' | 'fixed' | 'adjustable';

/** Partial duration for {@link AdjustableClock.forward}. */
export interface DurationParts {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  ms?: number;
}

/** Milliseconds or a structured duration object. */
export type DurationInput = number | DurationParts;

/** Injectable time source (analogous to `java.time.Clock`). */
export interface Clock {
  /** Current instant as a `Date` (UTC semantics via {@link Clock.instant}). */
  now(): Date;
  /** Epoch milliseconds for the current instant. */
  millis(): number;
  /** Current instant as an ISO-8601 UTC string (e.g. `2000-01-01T00:00:00.000Z`). */
  instant(): string;
}

/** Clock that can be moved for tests or simulations. */
export interface AdjustableClock extends Clock {
  /** Jump the clock to an instant (alias: {@link travelTo}). */
  fixTo(instant: InstantInput): void;
  /** Jump the clock to an instant (alias of {@link fixTo}). */
  travelTo(instant: InstantInput): void;
  /** Advance the clock by a duration. */
  forward(duration: DurationInput): void;
  /** Return the clock to the real current time (`Date.now()`). */
  reset(): void;
}

export type InstantInput = Date | string | number;

/** Configuration for {@link clockFromConfig} / {@link clockFromEnv}. */
export interface ClockConfig {
  /** One of `system`, `fixed`, or `adjustable` (case-insensitive). */
  type?: string;
  /** ISO-8601 instant; required when `type` is `fixed`. */
  fixedInstant?: string;
}

export const CLOCK_ENV = {
  type: 'CLOCK_TYPE',
  fixedInstant: 'CLOCK_FIXED_INSTANT',
} as const;
