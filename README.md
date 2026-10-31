# unified-clock

Injectable clock for Node.js: **system**, **fixed**, or **adjustable** time — a port of [quarkus-clock](https://github.com/quarkiverse/quarkus-clock) for the Node ecosystem.

Unlike [MockDate](https://www.npmjs.com/package/mockdate), [Sinon fake timers](https://sinonjs.org/releases/latest/fake-timers/), or patching global `Date`, **unified-clock** keeps time behind an injectable `Clock` type. Production code and tests share the same API; only the implementation changes.

- Zero runtime dependencies
- ESM and CommonJS builds with TypeScript types
- Node.js 20+

## Install

```bash
npm install unified-clock
```

## Quick start

```typescript
import {
  createSystemClock,
  createFixedClock,
  createAdjustableClock,
  isAdjustableClock,
  type Clock,
} from 'unified-clock';

// Default: real UTC time
const clock: Clock = createSystemClock();
console.log(clock.now(), clock.millis(), clock.instant());

// Deterministic tests
const fixed = createFixedClock('2000-01-01T00:00:00Z');

// Move time in tests without touching global Date
const adjustable = createAdjustableClock('2000-01-01T00:00:00Z');
adjustable.forward({ hours: 1 });
adjustable.travelTo('2010-01-01T00:00:00Z');
adjustable.reset(); // back to real Date.now()
```

## API

| Export | Description |
|--------|-------------|
| `Clock` | `now(): Date`, `millis(): number`, `instant(): string` (ISO-8601 UTC) |
| `createSystemClock()` | System clock (UTC instants) |
| `createFixedClock(instant)` | Constant instant |
| `createAdjustableClock(initial?)` | Mutable clock; use `isAdjustableClock()` to narrow |
| `AdjustableClock` | `fixTo` / `travelTo`, `forward(duration)`, `reset()` |
| `clockFromConfig(config)` | Build from `{ type, fixedInstant }` |
| `clockFromEnv(env?)` | Read `CLOCK_TYPE` / `CLOCK_FIXED_INSTANT` |
| `toDurationMillis`, `toEpochMillis` | Parsing helpers |

`forward` accepts milliseconds (`number`) or `{ days?, hours?, minutes?, seconds?, ms? }`.

## Configuration

Environment variables mirror [quarkus-clock configuration](https://github.com/quarkiverse/quarkus-clock/blob/main/docs/modules/ROOT/pages/configuration.adoc):

| Variable | Default | Description |
|----------|---------|-------------|
| `CLOCK_TYPE` | `system` | `system`, `fixed`, or `adjustable` (case-insensitive) |
| `CLOCK_FIXED_INSTANT` | _(empty)_ | Required when `CLOCK_TYPE=fixed`. Valid ISO-8601 instant (e.g. `2000-01-01T00:00:00Z`) |

```typescript
import { clockFromEnv, clockFromConfig } from 'unified-clock';

const clock = clockFromEnv(); // process.env

const testClock = clockFromConfig({
  type: 'fixed',
  fixedInstant: '2000-01-01T00:00:00Z',
});
```

Invalid types or missing/invalid fixed instants throw descriptive errors.

## Injection patterns

**Factory / dependency parameter**

```typescript
import type { Clock } from 'unified-clock';

export const createOrderService = (clock: Clock) => {
  const orderService = {
    createdAt: () => clock.instant(),
  } satisfies { readonly createdAt: () => string };

  return orderService;
};
```

**Module singleton**

```typescript
import { clockFromEnv } from 'unified-clock';

export const clock = clockFromEnv();
```

**NestJS provider**

```typescript
import { clockFromEnv, type Clock } from 'unified-clock';

export const CLOCK = Symbol('CLOCK');

export const clockProvider = {
  provide: CLOCK,
  useFactory: (): Clock => clockFromEnv(),
};
```

## Testing recipes

### Vitest — fixed clock

```typescript
import { describe, it, expect } from 'vitest';
import { createFixedClock, type Clock } from 'unified-clock';

describe('expiry', () => {
  const clock: Clock = createFixedClock('2000-01-01T00:00:00Z');

  it('expires after one day', () => {
    const expires = new Date(clock.millis() + 86_400_000);
    expect(expires.toISOString()).toBe('2000-01-02T00:00:00.000Z');
  });
});
```

### Vitest / Jest — adjustable clock

```typescript
import { createAdjustableClock, isAdjustableClock } from 'unified-clock';

const clock = createAdjustableClock('2000-01-01T00:00:00Z');
if (!isAdjustableClock(clock)) throw new Error('expected adjustable');

clock.forward(60_000);
expect(clock.instant()).toBe('2000-01-01T00:01:00.000Z');
clock.reset();
```

### Environment override in tests

```typescript
import { clockFromEnv } from 'unified-clock';

const clock = clockFromEnv({
  ...process.env,
  CLOCK_TYPE: 'fixed',
  CLOCK_FIXED_INSTANT: '2000-01-01T00:00:00Z',
});
```

## Credit

Behavior and configuration are inspired by [quarkus-clock](https://github.com/quarkiverse/quarkus-clock) (Quarkus extension for injectable `java.time.Clock`).

## License

Apache-2.0 — see [LICENSE](LICENSE).
