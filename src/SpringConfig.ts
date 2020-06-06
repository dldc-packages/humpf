export const DEFAULT_TIME_SCALE = 1 / 100;

export interface SpringConfig {
  position: number;
  velocity: number;
  equilibrium: number;
  angularFrequency: number;
  dampingRatio: number;
  timeScale: number;
  timeStart: number;
}

const DEFAULT_CONFIG: SpringConfig = {
  // initial position
  position: 0,
  // initial velocity
  velocity: 0,
  // position to approach
  equilibrium: 100,
  // angular frequency of motion
  angularFrequency: 1,
  // damping ratio of motion
  dampingRatio: 1,
  // [advanced] multiply time by this value
  timeScale: 1 / 100,
  // time at which the annimation should start (after timeScale)
  timeStart: 0
};

export const SpringConfig = {
  // presets
  basic,
  gentle,
  wobbly,
  stiff,
  slow,
  // special
  decay,
  static: staticConfig,
  // utils
  findEquilibrium,
  angularFrequencyFromMass,
  angularFrequencyFromSpringConstant
};

function basic(config: Partial<SpringConfig> = {}): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config
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
