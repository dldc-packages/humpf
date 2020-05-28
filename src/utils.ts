export const EPSILON: number = 0.00001;

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PREFIX = 'Invariant failed';

export function invariant(condition: boolean, message: string) {
  if (condition) {
    return;
  }
  if (IS_PRODUCTION) {
    throw new Error(PREFIX);
  }

  throw new Error(`${PREFIX}: ${message}`);
}

export function normalizeT(t: number, timeScale: number, timeStart: number): number {
  return Math.max(0, t * timeScale - timeStart * timeScale);
}
