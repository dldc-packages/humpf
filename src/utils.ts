import { SpringFn, SpringResult } from './Spring';
import { ISpringConfig } from './SpringConfig';

/**
 * This values is chosen to make a spring with dampingRatio of 0
 * get back to the original position in 1 unit of time
 * With this value a critically damped spring between 0 an 1 time unit
 * almost looks like a ease-in-out and almost reach it's destination
 */
const NORMALIZE_TIME_MULTIPLE = Math.PI * 2;

export function normalizeT(t: number, timeScale: number, timeStart: number): number {
  return (Math.max(0, t - timeStart) * NORMALIZE_TIME_MULTIPLE) / timeScale;
}

export function makeSpringFn(
  config: Partial<ISpringConfig>,
  main: (t: number) => SpringResult,
  position: (t: number) => number,
  velocity: (t: number) => number,
  stable: (t: number) => boolean,
): SpringFn {
  return Object.assign(main, { position, velocity, stable, config });
}

export function toPrecision(num: number, precision: number): number {
  return Math.round(num / precision) * precision;
}

export function isStable(res: SpringResult, conf: ISpringConfig): boolean {
  return (
    Math.abs(res.position - conf.equilibrium) <= conf.positionPrecision &&
    Math.abs(res.velocity) <= conf.velocityPrecision
  );
}
