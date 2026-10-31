import type { InstantInput } from './types.js';

const ISO_INSTANT =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

/**
 * Returns true when `value` looks like a valid ISO-8601 instant string.
 * Used for configuration validation (quarkus.clock.fixed-instant).
 */
export function isIso8601InstantString(value: string): boolean {
  if (!ISO_INSTANT.test(value)) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
}

/** Normalize user input to epoch milliseconds. */
export function toEpochMillis(instant: InstantInput, label = 'instant'): number {
  if (instant instanceof Date) {
    const ms = instant.getTime();
    if (Number.isNaN(ms)) {
      throw new Error(`Invalid ${label}: Date is NaN`);
    }
    return ms;
  }
  if (typeof instant === 'number') {
    if (!Number.isFinite(instant)) {
      throw new Error(`Invalid ${label}: expected a finite number of milliseconds`);
    }
    return instant;
  }
  if (typeof instant !== 'string' || instant.trim() === '') {
    throw new Error(`Invalid ${label}: expected ISO-8601 string, Date, or epoch milliseconds`);
  }
  const trimmed = instant.trim();
  if (!isIso8601InstantString(trimmed)) {
    throw new Error(
      `Invalid ${label}: "${trimmed}" is not a valid ISO-8601 instant (example: 2000-01-01T00:00:00Z)`,
    );
  }
  return Date.parse(trimmed);
}

/** Format epoch ms as ISO-8601 UTC (same shape as `Date#toISOString`). */
export function formatInstantUtc(epochMillis: number): string {
  return new Date(epochMillis).toISOString();
}
