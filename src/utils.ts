import { SpringFn, SpringResult } from './Spring';
import { SpringConfig } from './SpringConfig';

export const EPSILON: number = 0.00001;

export function invariant(condition: boolean, message: string): void {
  if (condition) {
    return;
  }
  throw new Error(`Invariant failed: ${message}`);
}

export function normalizeT(t: number, timeScale: number, timeStart: number): number {
  return Math.max(0, t * timeScale - timeStart * timeScale);
}

export function makeSpringFn(
  config: Partial<SpringConfig>,
  main: (t: number) => SpringResult,
  position: (t: number) => number,
  velocity: (t: number) => number
): SpringFn {
  return Object.assign(main, {
    position,
    velocity,
    // copy config to make sure it's not mutated
    config: { ...config },
  });
}
