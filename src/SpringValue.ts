import { SpringBuilderConfig, SpringBuilder } from './SpringBuilder';
import { SpringFn, SpringResult } from './types';

export interface SpringValueOptions {
  velocityThreshold: number;
  positionThreshold: number;
  onUpdate: () => void;
}

export interface SpringValue {
  get: SpringFn;
  done: (t: number) => boolean;
  update: (t: number, config: SpringBuilderConfig | SpringBuilder) => void;
  replace: (t: number, config: SpringBuilderConfig) => void;
  getConfig: () => Readonly<Required<SpringBuilderConfig>>;
}

export function SpringValue(
  config: SpringBuilderConfig | SpringBuilder = {},
  options: Partial<SpringValueOptions> = {}
): SpringValue {
  const { positionThreshold = 0.01, velocityThreshold = 0.001, onUpdate } = options;
  let builder: SpringBuilder =
    config instanceof SpringBuilder ? config : SpringBuilder.default(config);
  let spring: SpringFn = builder.spring;

  return {
    get,
    getConfig,
    done,
    update,
    replace
  };

  function get(t: number): SpringResult {
    return spring(t);
  }

  function getConfig(): Readonly<Required<SpringBuilderConfig>> {
    return builder.config;
  }

  function update(t: number, config: SpringBuilderConfig | SpringBuilder): void {
    const configResolved = config instanceof SpringBuilder ? config.config : config;
    const current = spring(t);
    const resolvedConfig: SpringBuilderConfig = {
      ...configResolved,
      timeStart: t,
      position: current.pos,
      velocity: current.vel
    };
    builder = builder.extends(resolvedConfig);
    spring = builder.spring;
    if (onUpdate) {
      onUpdate();
    }
  }

  function replace(t: number, config: SpringBuilderConfig): void {
    const current = spring(t);
    const resolvedConfig: SpringBuilderConfig = {
      timeStart: t,
      position: current.pos,
      velocity: current.vel,
      ...config
    };
    builder = builder.extends(resolvedConfig);
    spring = builder.spring;
    if (onUpdate) {
      onUpdate();
    }
  }

  function done(t: number): boolean {
    const val = spring(t);
    if (
      Math.abs(val.vel) < velocityThreshold &&
      Math.abs(val.pos - builder.config.equilibrium) < positionThreshold
    ) {
      return true;
    }
    return false;
  }
}
