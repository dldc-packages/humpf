import type { ISpringConfig } from "./types.ts";

// Default to 1000 so time is in milliseconds
export const DEFAULT_TIME_SCALE = 1000;

// This value ensure a valid binary rounding
export const DEFAULT_PRECISION = 1 / (1 << 14);

export const DEFAULT_CONFIG: ISpringConfig = {
  position: 0,
  velocity: 0,
  equilibrium: 1,
  angularFrequency: 1,
  dampingRatio: 1,
  timeScale: DEFAULT_TIME_SCALE,
  timeStart: 0,
  positionPrecision: DEFAULT_PRECISION,
  velocityPrecision: DEFAULT_PRECISION,
  dampingRatioPrecision: DEFAULT_PRECISION,
};

export function defaults(config: Partial<ISpringConfig> = {}): ISpringConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}

export function basic(
  config: Partial<ISpringConfig> = {},
): Partial<ISpringConfig> {
  return {
    angularFrequency: 1,
    dampingRatio: 1,
    ...config,
  };
}

export function gentle(
  config: Partial<ISpringConfig> = {},
): Partial<ISpringConfig> {
  return {
    angularFrequency: 0.6,
    dampingRatio: 0.6,
    ...config,
  };
}

export function wobbly(
  config: Partial<ISpringConfig> = {},
): Partial<ISpringConfig> {
  return {
    angularFrequency: 0.8,
    dampingRatio: 0.4,
    ...config,
  };
}

export function stiff(
  config: Partial<ISpringConfig> = {},
): Partial<ISpringConfig> {
  return {
    angularFrequency: 1.1,
    dampingRatio: 0.7,
    ...config,
  };
}

export function slow(
  config: Partial<ISpringConfig> = {},
): Partial<ISpringConfig> {
  return {
    angularFrequency: 0.5,
    dampingRatio: 1,
    ...config,
  };
}

export function decay(
  config: Partial<ISpringConfig> = {},
): Partial<ISpringConfig> {
  const resolved = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const equilibrium = resolved.position +
    findEquilibrium(resolved.velocity, resolved.angularFrequency);

  return {
    ...config,
    dampingRatio: 1,
    equilibrium,
  };
}

export function stable(
  equilibrium: number,
  config: Partial<ISpringConfig> = {},
): Partial<ISpringConfig> {
  return {
    ...config,
    velocity: 0,
    position: equilibrium,
    equilibrium,
  };
}

/**
 * Find the equilibrium position for a Critically damped spring
 */
export function findEquilibrium(
  velocity: number,
  angularFrequency: number = 1,
): number {
  return velocity / angularFrequency;
}

/**
 * Compute the angular frequency from the mass and spring constant
 * @param springContant
 * @param mass
 */
export function angularFrequencyFromMass(
  mass: number,
  springContant: number = 1,
): number {
  return Math.sqrt(springContant / mass);
}

/**
 * Compute the angular frequency from the mass and spring constant
 * @param springContant
 * @param mass
 */
export function angularFrequencyFromSpringConstant(
  springContant: number,
  mass: number = 1,
): number {
  return Math.sqrt(springContant / mass);
}
