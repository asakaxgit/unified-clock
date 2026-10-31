import { describe, expect, it } from 'vitest';
import { toDurationMillis } from '../src/duration.js';

describe('toDurationMillis', () => {
  it('converts structured durations', () => {
    expect(toDurationMillis({ hours: 1, minutes: 30 })).toBe(5_400_000);
  });

  it('rejects negative values', () => {
    expect(() => toDurationMillis({ seconds: -1 })).toThrow(/non-negative/);
    expect(() => toDurationMillis(-5)).toThrow(/non-negative/);
  });

  it('rejects invalid duration input', () => {
    expect(() => toDurationMillis(null as unknown as number)).toThrow(/Invalid duration/);
  });
});
