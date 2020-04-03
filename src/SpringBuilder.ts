import { Spring } from './Spring';
import { SpringFn, SpringConfig } from './types';
import { DEFAULT_TIME_SCALE } from './utils';

export class SpringBuilder {
  private springCache: SpringFn | null = null;
  public readonly config: Readonly<SpringConfig>;

  constructor(config: Partial<SpringConfig> = {}) {
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
      this.springCache = Spring.create(this.config);
    }
    return this.springCache;
  }

  public extends(config: Partial<SpringConfig>): SpringBuilder {
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

  public static default(config: Partial<SpringConfig> = {}): SpringBuilder {
    return new SpringBuilder(config);
  }

  public static decay(config: Partial<SpringConfig> = {}): SpringBuilder {
    return new SpringBuilder(config).decay();
  }

  public static gentle(config: Partial<SpringConfig> = {}): SpringBuilder {
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
