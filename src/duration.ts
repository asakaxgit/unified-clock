import type { DurationInput, DurationParts } from './types.js';

const assertNonNegative = (value: number, field: string): void => {
  if (value < 0) {
    throw new Error(`Invalid duration: ${field} must be non-negative, got ${value}`);
  }
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid duration: ${field} must be a finite number`);
  }
};

const partsToMillis = (parts: DurationParts): number => {
  const days = parts.days ?? 0;
  const hours = parts.hours ?? 0;
  const minutes = parts.minutes ?? 0;
  const seconds = parts.seconds ?? 0;
  const ms = parts.ms ?? 0;

  for (const [name, value] of [
    ['days', days],
    ['hours', hours],
    ['minutes', minutes],
    ['seconds', seconds],
    ['ms', ms],
  ] as const) {
    assertNonNegative(value, name);
  }

  return (
    days * 86_400_000 +
    hours * 3_600_000 +
    minutes * 60_000 +
    seconds * 1_000 +
    ms
  );
};

/** Convert milliseconds or duration parts to a non-negative millisecond count. */
export const toDurationMillis = (duration: DurationInput): number => {
  if (typeof duration === 'number') {
    assertNonNegative(duration, 'milliseconds');
    return duration;
  }
  if (duration === null || typeof duration !== 'object') {
    throw new Error('Invalid duration: expected a number of milliseconds or a duration object');
  }
  return partsToMillis(duration);
};
