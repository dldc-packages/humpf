import { SpringFn, SpringResult } from './Spring';
import { SpringConfig } from './SpringConfig';

/**
 * This values is chosen to make a spring with dampingRatio of 0
 * get back to the original position in 1 unit of time
 * With this value a critically damped spring between 0 an 1 time unit
 * almost looks like a ease-in-out and almost reach it's destination
 */
const NORMALIZE_TIME_MULTIPLE = Math.PI * 2;

export function invariant(condition: boolean, message: string): void {
  if (condition) {
    return;
  }
  throw new Error(`Invariant failed: ${message}`);
}

export function normalizeT(t: number, timeScale: number, timeStart: number): number {
  return (Math.max(0, t - timeStart) * NORMALIZE_TIME_MULTIPLE) / timeScale;
}

export function makeSpringFn(
  config: Partial<SpringConfig>,
  main: (t: number) => SpringResult,
  position: (t: number) => number,
  velocity: (t: number) => number
): SpringFn {
  return Object.assign(main, { position, velocity, config });
}

export function toPrecision(num: number, precision: number): number {
  return Math.round(num / precision) * precision;
}
