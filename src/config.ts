import process from 'node:process';

import { createAdjustableClock } from './clocks/adjustable-clock.js';
import { createFixedClock } from './clocks/fixed-clock.js';
import { createSystemClock } from './clocks/system-clock.js';
import { isIso8601InstantString } from './instant.js';
import type { Clock, ClockConfig, ClockEnv, ClockType } from './types.js';
import { CLOCK_ENV } from './types.js';

const parseClockType = (raw: string | undefined, source: string): ClockType => {
  if (raw === undefined || raw.trim() === '') {
    return 'system';
  }
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'system' || normalized === 'fixed' || normalized === 'adjustable') {
    return normalized;
  }
  throw new Error(
    `${source}: invalid clock type "${raw}". Expected one of: system, fixed, adjustable (case-insensitive).`,
  );
};

const validateFixedInstant = (fixedInstant: string | undefined, source: string): string => {
  if (fixedInstant === undefined || fixedInstant.trim() === '') {
    throw new Error(
      `${source}: CLOCK_FIXED_INSTANT (fixedInstant) is required when clock type is "fixed".`,
    );
  }
  const trimmed = fixedInstant.trim();
  if (!isIso8601InstantString(trimmed)) {
    throw new Error(
      `${source}: invalid fixed instant "${trimmed}". Must be a valid ISO-8601 instant (example: 2000-01-01T00:00:00Z).`,
    );
  }
  return trimmed;
};

/** Build a {@link Clock} from an explicit configuration object. */
export const clockFromConfig = (config: ClockConfig = {}): Clock => {
  const source = 'clockFromConfig()';
  const type = parseClockType(config.type, source);

  switch (type) {
    case 'system':
      return createSystemClock();
    case 'fixed': {
      const instant = validateFixedInstant(config.fixedInstant, source);
      return createFixedClock(instant);
    }
    case 'adjustable':
      return createAdjustableClock();
    default: {
      const _exhaustive: never = type;
      throw new Error(String(_exhaustive));
    }
  }
};

/**
 * Build a {@link Clock} from environment variables:
 * - `CLOCK_TYPE` — `system` | `fixed` | `adjustable` (default: `system`)
 * - `CLOCK_FIXED_INSTANT` — required when type is `fixed`
 */
export const clockFromEnv = (env: ClockEnv = process.env): Clock => {
  const source = 'clockFromEnv()';
  const type = parseClockType(env[CLOCK_ENV.type], source);
  const fixedInstant = env[CLOCK_ENV.fixedInstant];

  switch (type) {
    case 'system':
      return createSystemClock();
    case 'fixed': {
      const instant = validateFixedInstant(fixedInstant, source);
      return createFixedClock(instant);
    }
    case 'adjustable':
      return createAdjustableClock();
    default: {
      const _exhaustive: never = type;
      throw new Error(String(_exhaustive));
    }
  }
};
