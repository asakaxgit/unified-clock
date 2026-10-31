/** Runtime brand for clocks created by {@link createAdjustableClock}. */
export const adjustableClockBrand = Symbol('unified-clock.adjustable');

export type AdjustableClockBrand = {
  readonly [adjustableClockBrand]: true;
};
