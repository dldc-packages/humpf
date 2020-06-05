export const DEFAULT_TIME_SCALE = 1 / 100;

export interface SpringConfig {
  position: number; // initial velocity
  velocity: number; // initial velocity
  equilibrium: number; // position to approach
  angularFrequency: number; // angular frequency of motion
  dampingRatio: number; // damping ratio of motion
  timeScale: number; // multiply time by this value
  timeStart: number; // time at which the annimation should start (after timeScale)
}

export const SpringConfig = {
  basic,
  decay,
  static: staticConfig,
  gentle,
  wobbly,
  stiff,
  slow,
  // utils
  findEquilibrium,
  angularFrequencyFromMass,
  angularFrequencyFromSpringConstant
};

const DEFAULT_CONFIG: SpringConfig = {
  position: 0,
  velocity: 0,
  equilibrium: 100,
  angularFrequency: 1,
  dampingRatio: 1,
  timeScale: DEFAULT_TIME_SCALE,
  timeStart: 0
};

function basic(config: Partial<SpringConfig>): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config
  };
}

function decay(config: Partial<SpringConfig>): SpringConfig {
  const resolved = {
    ...DEFAULT_CONFIG,
    ...config
  };

  const equilibrium =
    resolved.position + findEquilibrium(resolved.velocity, resolved.angularFrequency);

  return {
    ...resolved,
    dampingRatio: 1,
    equilibrium
  };
}

function staticConfig(equilibrium: number, config: Partial<SpringConfig> = {}): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    velocity: 0,
    position: equilibrium,
    equilibrium
  };
}

function gentle(config: Partial<SpringConfig> = {}): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    angularFrequency: 0.6,
    dampingRatio: 0.6,
    ...config
  };
}

function wobbly(config: Partial<SpringConfig> = {}): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    angularFrequency: 0.8,
    dampingRatio: 0.4,
    ...config
  };
}

function stiff(config: Partial<SpringConfig> = {}): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    angularFrequency: 1.1,
    dampingRatio: 0.7,
    ...config
  };
}

function slow(config: Partial<SpringConfig> = {}): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    angularFrequency: 0.5,
    dampingRatio: 1,
    ...config
  };
}

/**
 * Find the equilibrium position for a Critically damped spring
 */
function findEquilibrium(velocity: number, angularFrequency: number = 1) {
  return velocity / angularFrequency;
}

/**
 * Compute the angular frequency from the mass and spring constant
 * @param springContant
 * @param mass
 */
function angularFrequencyFromMass(mass: number, springContant: number = 1): number {
  return Math.sqrt(springContant / mass);
}

/**
 * Compute the angular frequency from the mass and spring constant
 * @param springContant
 * @param mass
 */
function angularFrequencyFromSpringConstant(springContant: number, mass: number = 1): number {
  return Math.sqrt(springContant / mass);
}
