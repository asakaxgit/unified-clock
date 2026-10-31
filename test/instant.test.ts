import { describe, expect, it } from 'vitest';
import { isIso8601InstantString, toEpochMillis } from '../src/instant.js';

describe('instant parsing', () => {
  it('validates ISO-8601 instants', () => {
    expect(isIso8601InstantString('2000-01-01T00:00:00Z')).toBe(true);
    expect(isIso8601InstantString('2000-01-01T00:00:00.123Z')).toBe(true);
    expect(isIso8601InstantString('not-a-date')).toBe(false);
    expect(isIso8601InstantString('2000-01-01')).toBe(false);
  });

  it('toEpochMillis throws on invalid input', () => {
    expect(() => toEpochMillis('bad')).toThrow(/ISO-8601/);
    expect(() => toEpochMillis(Number.NaN)).toThrow(/finite/);
    expect(() => toEpochMillis(new Date(Number.NaN))).toThrow(/NaN/);
    expect(() => toEpochMillis('   ')).toThrow(/ISO-8601/);
  });
});
