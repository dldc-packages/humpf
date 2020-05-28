import { SpringConfig } from './SpringConfig';
import { Spring } from './Spring';

export interface SpringValueOptions {
  velocityThreshold: number;
  positionThreshold: number;
  onSpringChange: () => void;
  now: () => number;
}

export interface SpringValue {
  position: () => number;
  velocity: () => number;
  stable: () => boolean;
  getConfig: () => Readonly<Required<SpringConfig>>;
  // updates
  decay: (angularFrequency?: number) => void;
  update: (config: Partial<SpringConfig>) => void;
  replace: (config: Partial<SpringConfig>) => void;
}

export function SpringValue(
  initialConfig: Partial<SpringConfig> = {},
  options: Partial<SpringValueOptions> = {}
): SpringValue {
  const {
    onSpringChange,
    positionThreshold = 0.01,
    velocityThreshold = 0.001,
    now = Date.now
  } = options;

  let config = SpringConfig.basic({ timeStart: now(), ...initialConfig });

  let spring = Spring(config);

  return {
    position,
    velocity,
    stable,
    getConfig,
    decay,
    update,
    replace
  };

  function position(): number {
    return spring(now()).pos;
  }

  function velocity(): number {
    return spring(now()).vel;
  }

  function stable(): boolean {
    const val = spring(now());
    if (
      Math.abs(val.vel) < velocityThreshold &&
      Math.abs(val.pos - config.equilibrium) < positionThreshold
    ) {
      return true;
    }
    return false;
  }

  function getConfig(): Readonly<Required<SpringConfig>> {
    return config;
  }

  function decay(angularFrequency: number = config.angularFrequency): void {
    config = SpringConfig.decay({
      ...config,
      angularFrequency,
      timeStart: now(),
      position: position(),
      velocity: velocity()
    });
    spring = Spring(config);
    if (onSpringChange) {
      onSpringChange();
    }
  }

  function update(config: Partial<SpringConfig>) {
    config = {
      ...config,
      timeStart: now(),
      position: position(),
      velocity: velocity()
    };
    spring = Spring(config);
    if (onSpringChange) {
      onSpringChange();
    }
  }

  function replace(config: Partial<SpringConfig>): void {
    config = {
      timeStart: now(),
      position: position(),
      velocity: velocity(),
      ...config
    };
    spring = Spring(config);
    if (onSpringChange) {
      onSpringChange();
    }
  }
}
