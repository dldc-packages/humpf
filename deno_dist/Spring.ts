import { invariant, EPSILON, normalizeT, makeSpringFn } from './utils.ts';
import { SpringConfig } from './SpringConfig.ts';

export interface SpringResult {
  position: number;
  velocity: number;
}

export interface SpringFn {
  (t: number): SpringResult;
  readonly position: (t: number) => number;
  readonly velocity: (t: number) => number;
  readonly config: Readonly<Partial<SpringConfig>>;
}

export function Spring(config: Partial<SpringConfig> = {}): SpringFn {
  const conf = SpringConfig.defaults(config);

  invariant(conf.dampingRatio >= 0, 'Damping Ration must be >= 0');
  invariant(conf.angularFrequency >= 0, 'Angular Frequency must be >= 0');

  // if there is no angular frequency or the spring is stable,
  // then the spring will not move and we can
  // return identity to save some computation
  if (conf.angularFrequency <= EPSILON) {
    return springIdentity(conf.position, conf.velocity, config);
  }
  const isStable = Math.abs(conf.position - conf.equilibrium) <= EPSILON && Math.abs(conf.velocity) <= EPSILON;
  if (isStable) {
    return springIdentity(conf.position, conf.velocity, config);
  }
  if (conf.dampingRatio > 1 + EPSILON) {
    // over-damped
    return springOverDamped(conf, config);
  }
  if (conf.dampingRatio < 1 - EPSILON) {
    // under-damped
    return springUnderDamped(conf, config);
  }
  // else
  // critically damped
  return springCriticallyDamped(conf, config);
}

function springIdentity(position: number, velocity: number, originalConf: Partial<SpringConfig>): SpringFn {
  const identity = { position, velocity };
  return makeSpringFn(
    originalConf,
    () => identity,
    () => position,
    () => velocity
  );
}

function springOverDamped(conf: SpringConfig, originalConf: Partial<SpringConfig>): SpringFn {
  const za = -conf.angularFrequency * conf.dampingRatio;
  const zb = conf.angularFrequency * Math.sqrt(conf.dampingRatio * conf.dampingRatio - 1);
  const z1 = za - zb;
  const z2 = za + zb;
  const invTwoZb = 1 / (2 * zb);
  const posDiff = conf.position - conf.equilibrium;

  return makeSpringFn(
    originalConf,
    (t: number) => {
      const [e2, e1_Over_TwoZb, e2_Over_TwoZb, z2e2_Over_TwoZb] = springOverDampedCommon(t, conf.timeScale, conf.timeStart, z1, z2, invTwoZb);
      return {
        position: springOverDampedPosition(conf.equilibrium, posDiff, e1_Over_TwoZb, z2, z2e2_Over_TwoZb, e2, conf.velocity, e2_Over_TwoZb),
        velocity: springOverDampedVelocity(posDiff, z1, e1_Over_TwoZb, z2e2_Over_TwoZb, e2, z2, conf.velocity),
      };
    },
    (t) => {
      const [e2, e1_Over_TwoZb, e2_Over_TwoZb, z2e2_Over_TwoZb] = springOverDampedCommon(t, conf.timeScale, conf.timeStart, z1, z2, invTwoZb);
      return springOverDampedPosition(conf.equilibrium, posDiff, e1_Over_TwoZb, z2, z2e2_Over_TwoZb, e2, conf.velocity, e2_Over_TwoZb);
    },
    (t) => {
      const [e2, e1_Over_TwoZb, _e2_Over_TwoZb, z2e2_Over_TwoZb] = springOverDampedCommon(t, conf.timeScale, conf.timeStart, z1, z2, invTwoZb);
      return springOverDampedVelocity(posDiff, z1, e1_Over_TwoZb, z2e2_Over_TwoZb, e2, z2, conf.velocity);
    }
  );
}

type OverDampedCommon = [e2: number, e1_Over_TwoZb: number, e2_Over_TwoZb: number, z2e2_Over_TwoZb: number];

function springOverDampedCommon(t: number, timeScale: number, timeStart: number, z1: number, z2: number, invTwoZb: number): OverDampedCommon {
  const nt = normalizeT(t, timeScale, timeStart);
  const e1 = Math.exp(z1 * nt);
  const e2 = Math.exp(z2 * nt);
  const e1_Over_TwoZb = e1 * invTwoZb;
  const e2_Over_TwoZb = e2 * invTwoZb;
  const z2e2_Over_TwoZb = z2 * e2_Over_TwoZb;
  return [e2, e1_Over_TwoZb, e2_Over_TwoZb, z2e2_Over_TwoZb];
}

function springOverDampedPosition(
  equi: number,
  posDiff: number,
  e1_Over_TwoZb: number,
  z2: number,
  z2e2_Over_TwoZb: number,
  e2: number,
  vel: number,
  e2_Over_TwoZb: number
): number {
  return equi + posDiff * (e1_Over_TwoZb * z2 - z2e2_Over_TwoZb + e2) + vel * (-e1_Over_TwoZb + e2_Over_TwoZb);
}

function springOverDampedVelocity(
  posDiff: number,
  z1: number,
  e1_Over_TwoZb: number,
  z2e2_Over_TwoZb: number,
  e2: number,
  z2: number,
  vel: number
): number {
  const z1e1_Over_TwoZb = z1 * e1_Over_TwoZb;
  return posDiff * ((z1e1_Over_TwoZb - z2e2_Over_TwoZb + e2) * z2) + vel * (-z1e1_Over_TwoZb + z2e2_Over_TwoZb);
}

function springUnderDamped(conf: SpringConfig, originalConf: Partial<SpringConfig>): SpringFn {
  const omegaZeta = conf.angularFrequency * conf.dampingRatio;
  const alpha = conf.angularFrequency * Math.sqrt(1 - conf.dampingRatio * conf.dampingRatio);
  const posDiff = conf.position - conf.equilibrium;

  return makeSpringFn(
    originalConf,
    (t: number) => {
      const [invAlpha, expSin, expCos, expOmegaZetaSin_Over_Alpha] = springUnderDampedCommon(t, conf.timeScale, conf.timeStart, omegaZeta, alpha);
      return {
        position: springUnderDampedPosition(conf.equilibrium, posDiff, expCos, expOmegaZetaSin_Over_Alpha, conf.velocity, expSin, invAlpha),
        velocity: springUnderDampedVelocity(posDiff, expSin, alpha, omegaZeta, expOmegaZetaSin_Over_Alpha, conf.velocity, expCos),
      };
    },
    (t) => {
      const [invAlpha, expSin, expCos, expOmegaZetaSin_Over_Alpha] = springUnderDampedCommon(t, conf.timeScale, conf.timeStart, omegaZeta, alpha);
      return springUnderDampedPosition(conf.equilibrium, posDiff, expCos, expOmegaZetaSin_Over_Alpha, conf.velocity, expSin, invAlpha);
    },
    (t) => {
      const [_invAlpha, expSin, expCos, expOmegaZetaSin_Over_Alpha] = springUnderDampedCommon(t, conf.timeScale, conf.timeStart, omegaZeta, alpha);
      return springUnderDampedVelocity(posDiff, expSin, alpha, omegaZeta, expOmegaZetaSin_Over_Alpha, conf.velocity, expCos);
    }
  );
}

type UnderDampedCommon = [invAlpha: number, expSin: number, expCos: number, expOmegaZetaSin_Over_Alpha: number];

function springUnderDampedCommon(t: number, timeScale: number, timeStart: number, omegaZeta: number, alpha: number): UnderDampedCommon {
  const nt = normalizeT(t, timeScale, timeStart);
  const expTerm = Math.exp(-omegaZeta * nt);
  const cosTerm = Math.cos(alpha * nt);
  const sinTerm = Math.sin(alpha * nt);
  const invAlpha = 1 / alpha;
  const expSin = expTerm * sinTerm;
  const expCos = expTerm * cosTerm;
  const expOmegaZetaSin_Over_Alpha = expTerm * omegaZeta * sinTerm * invAlpha;
  return [invAlpha, expSin, expCos, expOmegaZetaSin_Over_Alpha];
}

function springUnderDampedPosition(
  equilibrium: number,
  posDiff: number,
  expCos: number,
  expOmegaZetaSin_Over_Alpha: number,
  velocity: number,
  expSin: number,
  invAlpha: number
): number {
  return equilibrium + posDiff * (expCos + expOmegaZetaSin_Over_Alpha) + velocity * (expSin * invAlpha);
}

function springUnderDampedVelocity(
  posDiff: number,
  expSin: number,
  alpha: number,
  omegaZeta: number,
  expOmegaZetaSin_Over_Alpha: number,
  velocity: number,
  expCos: number
): number {
  return posDiff * (-expSin * alpha - omegaZeta * expOmegaZetaSin_Over_Alpha) + velocity * (expCos - expOmegaZetaSin_Over_Alpha);
}

function springCriticallyDamped(conf: SpringConfig, originalConf: Partial<SpringConfig>): SpringFn {
  const oldPos = conf.position - conf.equilibrium; // update in equilibrium relative space
  return makeSpringFn(
    originalConf,
    (t: number) => {
      const [expTerm, timeExp, timeExpFreq] = springCriticallyDampedCommon(t, conf.timeScale, conf.timeStart, conf.angularFrequency);
      return {
        position: springCriticallyDampedPosition(oldPos, timeExpFreq, expTerm, conf.velocity, timeExp, conf.equilibrium),
        velocity: springCriticallyDampedVelocity(oldPos, conf.angularFrequency, timeExpFreq, conf.velocity, expTerm),
      };
    },
    (t) => {
      const [expTerm, timeExp, timeExpFreq] = springCriticallyDampedCommon(t, conf.timeScale, conf.timeStart, conf.angularFrequency);
      return springCriticallyDampedPosition(oldPos, timeExpFreq, expTerm, conf.velocity, timeExp, conf.equilibrium);
    },
    (t) => {
      const [expTerm, _timeExp, timeExpFreq] = springCriticallyDampedCommon(t, conf.timeScale, conf.timeStart, conf.angularFrequency);
      return springCriticallyDampedVelocity(oldPos, conf.angularFrequency, timeExpFreq, conf.velocity, expTerm);
    }
  );
}

type CriticallyDampedCommon = [expTerm: number, timeExp: number, timeExpFreq: number];

function springCriticallyDampedCommon(t: number, timeScale: number, timeStart: number, angularFrequency: number): CriticallyDampedCommon {
  const nt = normalizeT(t, timeScale, timeStart);
  const expTerm = Math.exp(-angularFrequency * nt);
  const timeExp = nt * expTerm;
  const timeExpFreq = timeExp * angularFrequency;
  return [expTerm, timeExp, timeExpFreq];
}

function springCriticallyDampedPosition(
  oldPos: number,
  timeExpFreq: number,
  expTerm: number,
  velocity: number,
  timeExp: number,
  equilibrium: number
): number {
  return oldPos * (timeExpFreq + expTerm) + velocity * timeExp + equilibrium;
}

function springCriticallyDampedVelocity(oldPos: number, angularFrequency: number, timeExpFreq: number, velocity: number, expTerm: number): number {
  return oldPos * (-angularFrequency * timeExpFreq) + velocity * (-timeExpFreq + expTerm);
}