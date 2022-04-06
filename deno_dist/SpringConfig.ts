// Default to 1000 so time is in milliseconds
export const DEFAULT_TIME_SCALE = 1000;

// This value ensure a valid binary rounding
export const DEFAULT_PRECISION = 1 / (1 << 14);

export interface SpringConfig {
  // initial position
  position: number;
  // initial velocity
  velocity: number;
  // position to approach
  equilibrium: number;
  // angular frequency of motion
  angularFrequency: number;
  // damping ratio of motion
  dampingRatio: number;
  // The default timeScale is 1000 so that 1 time unit is 1ms
  // Set timeScale to 1 to make 1 unit 1s
  timeScale: number;
  // time at which the animation should start
  timeStart: number;
  positionPrecision: number;
  velocityPrecision: number;
  dampingRatioPrecision: number;
}

const DEFAULT_CONFIG: SpringConfig = {
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

export const SpringConfig = {
  defaults,
  // presets
  basic,
  gentle,
  wobbly,
  stiff,
  slow,
  // special
  decay,
  stable,
  // utils
  findEquilibrium,
  angularFrequencyFromMass,
  angularFrequencyFromSpringConstant,
};

function defaults(config: Partial<SpringConfig> = {}): SpringConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}

function basic(config: Partial<SpringConfig> = {}): Partial<SpringConfig> {
  return {
    angularFrequency: 1,
    dampingRatio: 1,
    ...config,
  };
}

function gentle(config: Partial<SpringConfig> = {}): Partial<SpringConfig> {
  return {
    angularFrequency: 0.6,
    dampingRatio: 0.6,
    ...config,
  };
}

function wobbly(config: Partial<SpringConfig> = {}): Partial<SpringConfig> {
  return {
    angularFrequency: 0.8,
    dampingRatio: 0.4,
    ...config,
  };
}

function stiff(config: Partial<SpringConfig> = {}): Partial<SpringConfig> {
  return {
    angularFrequency: 1.1,
    dampingRatio: 0.7,
    ...config,
  };
}

function slow(config: Partial<SpringConfig> = {}): Partial<SpringConfig> {
  return {
    angularFrequency: 0.5,
    dampingRatio: 1,
    ...config,
  };
}

function decay(config: Partial<SpringConfig> = {}): Partial<SpringConfig> {
  const resolved = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const equilibrium = resolved.position + findEquilibrium(resolved.velocity, resolved.angularFrequency);

  return {
    ...config,
    dampingRatio: 1,
    equilibrium,
  };
}

function stable(equilibrium: number, config: Partial<SpringConfig> = {}): Partial<SpringConfig> {
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
function findEquilibrium(velocity: number, angularFrequency: number = 1): number {
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
