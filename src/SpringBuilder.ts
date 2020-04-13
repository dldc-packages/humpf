import { Spring } from './Spring';
import { SpringFn, SpringConfig, SpringResult } from './types';
import { DEFAULT_TIME_SCALE } from './utils';

export type SpringBuilderConfig = Partial<SpringConfig>;

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
      timeStart = 0
    } = config;
    this.config = {
      position,
      velocity,
      equilibrium,
      angularFrequency,
      dampingRatio,
      timeScale,
      timeStart
    };
  }

  get spring(): SpringFn {
    if (!this.springCache) {
      const isStatic =
        this.config.position === this.config.equilibrium && this.config.velocity === 0;
      if (isStatic) {
        const result: SpringResult = { pos: this.config.equilibrium, vel: 0 };
        this.springCache = () => result;
      } else {
        const spr = Spring.create(this.config);
        this.springCache = spr;
      }
    }
    return this.springCache;
  }

  public withEquilibrium(equilibrium: number): SpringBuilder {
    return new SpringBuilder({
      ...this.config,
      equilibrium
    });
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

  public static(equilibrium: number): SpringBuilder {
    return this.extends({
      velocity: 0,
      position: equilibrium,
      equilibrium
    });
  }

  /**
   * PRESETS
   */

  public static default(config: SpringBuilderConfig = {}): SpringBuilder {
    return new SpringBuilder(config);
  }

  public static static(equilibrium: number): SpringBuilder {
    return new SpringBuilder({
      velocity: 0,
      dampingRatio: 1,
      angularFrequency: 1,
      position: equilibrium,
      equilibrium
    });
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
