export type {
  AdjustableClock,
  Clock,
  ClockConfig,
  ClockEnvKeys,
  ClockType,
  DurationInput,
  DurationParts,
  InstantInput,
} from './types.js';
export { CLOCK_ENV } from './types.js';

export { createSystemClock } from './clocks/system-clock.js';
export { createFixedClock } from './clocks/fixed-clock.js';
export {
  createAdjustableClock,
  isAdjustableClock,
  type AdjustableClockInstance,
  type AdjustableClockMarker,
} from './clocks/adjustable-clock.js';

export { clockFromConfig, clockFromEnv } from './config.js';
export { isIso8601InstantString, toEpochMillis, formatInstantUtc } from './instant.js';
export { toDurationMillis } from './duration.js';
