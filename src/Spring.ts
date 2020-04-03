import { invariant, EPSILON } from './utils';
import { SpringBuilder } from './SpringBuilder';

export interface SpringResult {
  pos: number;
  vel: number;
}

export interface SpringConfig {
  position: number; // initial velocity
  velocity: number; // initial velocity
  equilibrium: number; // position to approach
  angularFrequency: number; // angular frequency of motion
  dampingRatio: number; // damping ratio of motion
  timeScale: number; // multiply time by this value
  timeStart: number; // time at which the annimation should start (after timeScale)
}

export type Spring = (t: number) => SpringResult;

export const Spring = {
  create: spring,
  findEquilibrium
};

/**
 * Find the equilibrium position for a Critically damped spring
 */
function findEquilibrium(velocity: number, angularFrequency: number = 1) {
  return velocity / angularFrequency;
}

function normalizeT(t: number, timeScale: number, timeStart: number): number {
  return Math.max(0, t * timeScale - timeStart * timeScale);
}

function spring(options: Partial<SpringConfig> = {}): Spring {
  const {
    velocity,
    equilibrium,
    angularFrequency,
    dampingRatio,
    position,
    timeScale,
    timeStart
  } = new SpringBuilder(options).config;

  invariant(dampingRatio >= 0, 'Damping Ration must be >= 0');
  invariant(angularFrequency >= 0, 'Angular Frequency must be >= 0');

  // if there is no angular frequency, the spring will not move and we can
  // return identity
  if (angularFrequency <= EPSILON) {
    const identity = {
      vel: velocity,
      pos: position
    };
    return () => identity;
  }

  if (dampingRatio > 1 + EPSILON) {
    // over-damped
    return springOverDamped(
      position,
      velocity,
      equilibrium,
      angularFrequency,
      dampingRatio,
      timeScale,
      timeStart
    );
  }
  if (dampingRatio < 1 - EPSILON) {
    // under-damped
    return springUnderDamped(
      position,
      velocity,
      equilibrium,
      angularFrequency,
      dampingRatio,
      timeScale,
      timeStart
    );
  }
  // else
  // critically damped
  return springCriticallyDamped(
    position,
    velocity,
    equilibrium,
    angularFrequency,
    timeScale,
    timeStart
  );
}

function springOverDamped(
  position: number,
  velocity: number,
  equilibrium: number,
  angularFrequency: number,
  dampingRatio: number,
  timeScale: number,
  timeStart: number
): Spring {
  const za = -angularFrequency * dampingRatio;
  const zb = angularFrequency * Math.sqrt(dampingRatio * dampingRatio - 1);
  const z1 = za - zb;
  const z2 = za + zb;
  const invTwoZb = 1 / (2 * zb);

  return (t: number) => {
    const nt = normalizeT(t, timeScale, timeStart);
    const e1 = Math.exp(z1 * nt);
    const e2 = Math.exp(z2 * nt);
    const e1_Over_TwoZb = e1 * invTwoZb;
    const e2_Over_TwoZb = e2 * invTwoZb;
    const z1e1_Over_TwoZb = z1 * e1_Over_TwoZb;
    const z2e2_Over_TwoZb = z2 * e2_Over_TwoZb;
    return {
      pos:
        equilibrium +
        (position - equilibrium) * (e1_Over_TwoZb * z2 - z2e2_Over_TwoZb + e2) +
        velocity * (-e1_Over_TwoZb + e2_Over_TwoZb),
      vel:
        (position - equilibrium) * ((z1e1_Over_TwoZb - z2e2_Over_TwoZb + e2) * z2) +
        velocity * (-z1e1_Over_TwoZb + z2e2_Over_TwoZb)
    };
  };
}

function springUnderDamped(
  position: number,
  velocity: number,
  equilibrium: number,
  angularFrequency: number,
  dampingRatio: number,
  timeScale: number,
  timeStart: number
): Spring {
  const omegaZeta = angularFrequency * dampingRatio;
  const alpha = angularFrequency * Math.sqrt(1 - dampingRatio * dampingRatio);

  return (t: number) => {
    const nt = normalizeT(t, timeScale, timeStart);
    const expTerm = Math.exp(-omegaZeta * nt);
    const cosTerm = Math.cos(alpha * nt);
    const sinTerm = Math.sin(alpha * nt);
    const invAlpha = 1 / alpha;
    const expSin = expTerm * sinTerm;
    const expCos = expTerm * cosTerm;
    const expOmegaZetaSin_Over_Alpha = expTerm * omegaZeta * sinTerm * invAlpha;
    return {
      pos:
        equilibrium +
        (position - equilibrium) * (expCos + expOmegaZetaSin_Over_Alpha) +
        velocity * (expSin * invAlpha),
      vel:
        (position - equilibrium) * (-expSin * alpha - omegaZeta * expOmegaZetaSin_Over_Alpha) +
        velocity * (expCos - expOmegaZetaSin_Over_Alpha)
    };
  };
}

function springCriticallyDamped(
  position: number,
  velocity: number,
  equilibrium: number,
  angularFrequency: number,
  timeScale: number,
  timeStart: number
): Spring {
  const oldPos = position - equilibrium; // update in equilibrium relative space
  return (t: number) => {
    const nt = normalizeT(t, timeScale, timeStart);
    const expTerm = Math.exp(-angularFrequency * nt);
    const timeExp = nt * expTerm;
    const timeExpFreq = timeExp * angularFrequency;
    return {
      pos: oldPos * (timeExpFreq + expTerm) + velocity * timeExp + equilibrium,
      vel: oldPos * (-angularFrequency * timeExpFreq) + velocity * (-timeExpFreq + expTerm)
    };
  };
}
