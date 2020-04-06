import { Spring } from './Spring';
import { SpringFn, SpringConfig, SpringResult } from './types';
import { DEFAULT_TIME_SCALE } from './utils';

export interface SpringBuilderConfig extends Partial<SpringConfig> {
  optimized?: boolean | OptimizedConfig;
}

export interface OptimizedConfig {
  velocityThreshold: number;
  positionThreshold: number;
}

export const DEFAULT_OPTIMIZED: OptimizedConfig = {
  positionThreshold: 0.01,
  velocityThreshold: 0.001
};

export class SpringBuilder {
  private springCache: SpringFn | null = null;
  public readonly config: Readonly<Required<SpringBuilderConfig>>;

  constructor(config: SpringBuilderConfig = {}) {
    const {
      position = 0,
      velocity = 0,
      equilibrium = 100,
      angularFrequency = 1,
      dampingRatio = 1,
      timeScale = DEFAULT_TIME_SCALE,
      timeStart = 0,
      optimized = true
    } = config;
    this.config = {
      position,
      velocity,
      equilibrium,
      angularFrequency,
      dampingRatio,
      timeScale,
      timeStart,
      optimized
    };
  }

  get spring(): SpringFn {
    if (!this.springCache) {
      const spr = Spring.create(this.config);
      if (this.config.optimized === false) {
        this.springCache = spr;
      } else {
        const optimized =
          this.config.optimized === true ? DEFAULT_OPTIMIZED : this.config.optimized;
        let resolved = false;
        const resolvedResult: SpringResult = { pos: this.config.equilibrium, vel: 0 };
        this.springCache = (t: number) => {
          if (resolved) {
            return resolvedResult;
          }
          const val = spr(t);
          if (Math.abs(val.vel) < optimized.velocityThreshold) {
            if (Math.abs(val.pos - resolvedResult.pos) < optimized.positionThreshold) {
              resolved = true;
              return resolvedResult;
            }
          }
          return val;
        };
      }
    }
    return this.springCache;
  }

  public extends(config: SpringBuilderConfig): SpringBuilder {
    return new SpringBuilder({
      ...this.config,
      ...config
    });
  }

  /**
   * Set dampingRatio to one (critically damped)
   * And find equilibrium from velocity
   */
  public decay(): SpringBuilder {
    const equilibrium =
      this.config.position +
      Spring.findEquilibrium(this.config.velocity, this.config.angularFrequency);

    return this.extends({
      dampingRatio: 1,
      equilibrium
    });
  }

  /**
   * PRESETS
   */

  public static default(config: SpringBuilderConfig = {}): SpringBuilder {
    return new SpringBuilder(config);
  }

  public static decay(config: SpringBuilderConfig = {}): SpringBuilder {
    return new SpringBuilder(config).decay();
  }

  public static gentle(config: SpringBuilderConfig = {}): SpringBuilder {
    return new SpringBuilder({
      angularFrequency: 0.6,
      dampingRatio: 0.6,
      ...config
    });
  }

  public static wobbly(config: Partial<SpringConfig> = {}): SpringBuilder {
    return new SpringBuilder({
      angularFrequency: 0.8,
      dampingRatio: 0.4,
      ...config
    });
  }

  public static stiff(config: Partial<SpringConfig> = {}): SpringBuilder {
    return new SpringBuilder({
      angularFrequency: 1.1,
      dampingRatio: 0.7,
      ...config
    });
  }

  public static slow(config: Partial<SpringConfig> = {}): SpringBuilder {
    return new SpringBuilder({
      angularFrequency: 0.5,
      dampingRatio: 1,
      ...config
    });
  }
}
