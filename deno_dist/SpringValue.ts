import { SpringConfig } from './SpringConfig.ts';
import { Spring } from './Spring.ts';

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

export function SpringValue(initialConfig: Partial<SpringConfig> = {}, options: Partial<SpringValueOptions> = {}): SpringValue {
  const { positionThreshold = 0.01, velocityThreshold = 0.001, onSpringChange, now = Date.now } = options;

  let config: SpringConfig = SpringConfig.defaults({ timeStart: now(), ...initialConfig });

  let spring = Spring(config);

  return {
    position,
    velocity,
    stable,
    getConfig,
    decay,
    update,
    replace,
  };

  function position(): number {
    return spring(now()).position;
  }

  function velocity(): number {
    return spring(now()).velocity;
  }

  function stable(): boolean {
    const val = spring(now());
    if (Math.abs(val.velocity) < velocityThreshold && Math.abs(val.position - config.equilibrium) < positionThreshold) {
      return true;
    }
    return false;
  }

  function getConfig(): Readonly<Required<SpringConfig>> {
    return config;
  }

  function decay(angularFrequency: number = config.angularFrequency): void {
    config = SpringConfig.defaults(
      SpringConfig.decay({
        ...config,
        angularFrequency,
        timeStart: now(),
        position: position(),
        velocity: velocity(),
      })
    );
    spring = Spring(config);
    if (onSpringChange) {
      onSpringChange();
    }
  }

  function update(configUpdate: Partial<SpringConfig>) {
    config = {
      ...config,
      ...configUpdate,
      timeStart: now(),
      position: position(),
      velocity: velocity(),
    };
    spring = Spring(config);
    if (onSpringChange) {
      onSpringChange();
    }
  }

  function replace(configReplace: Partial<SpringConfig>): void {
    config = {
      ...config,
      timeStart: now(),
      position: position(),
      velocity: velocity(),
      ...configReplace,
    };
    spring = Spring(config);
    if (onSpringChange) {
      onSpringChange();
    }
  }
}