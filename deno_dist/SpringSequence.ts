import { Spring, SpringFn, SpringResult } from './Spring.ts';
import { DEFAULT_TIME_SCALE, SpringConfig } from './SpringConfig.ts';

type SpringSequenceStep = { time: number; config: Partial<SpringConfig>; spring: SpringFn | null };

export interface SpringSequenceFn {
  (t: number): SpringResult;
  readonly position: (t: number) => number;
  readonly velocity: (t: number) => number;
}

type SpringSequenceConfig = {
  timeScale?: number;
  defaultConfig?: Partial<SpringConfig>;
  initial?: Partial<SpringResult>;
};

export class SpringSequence {
  public static create(options: SpringSequenceConfig = {}): SpringSequence {
    return new SpringSequence([], options);
  }

  private readonly steps: Array<SpringSequenceStep> = [];
  private timeScale: number;
  private defaultConfig: Partial<SpringConfig>;
  // spring that return initial state at any time
  private initialSpring: SpringSequenceFn;

  public readonly spring: SpringSequenceFn;

  private constructor(steps: Array<SpringSequenceStep>, { timeScale = DEFAULT_TIME_SCALE, defaultConfig = {}, initial = {} }: SpringSequenceConfig) {
    this.steps = steps;
    this.timeScale = timeScale;
    this.defaultConfig = defaultConfig;
    this.initialSpring = createInitialSpring({ position: initial.position ?? 0, velocity: initial.velocity ?? 0 });
    this.spring = Object.assign((t: number): SpringResult => this.findSpringAt(t)(t), {
      position: (t: number) => this.findSpringAt(t).position(t),
      velocity: (t: number) => this.findSpringAt(t).velocity(t),
    });
  }

  private readonly findSpringAt = (t: number): SpringSequenceFn => {
    const step = this.findMaybeStepAt(t);
    if (step) {
      return stepSprinOrThrow(step);
    }
    return this.initialSpring;
  };

  /**
   * Return the first step where t is >= to step.time
   * Return null if t is before first step or no steps
   */
  private readonly findMaybeStepAt = (t: number): SpringSequenceStep | null => {
    if (this.steps.length === 0) {
      return null;
    }
    if (t < this.steps[0].time) {
      // t is before first time
      return null;
    }
    let prev: null | SpringSequenceStep = null;
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (t < step.time) {
        break;
      }
      prev = step;
    }
    return prev;
  };

  /**
   * Update each step starting at the index
   */
  private readonly updateFromIndex = (index: number): void => {
    const indexResolved = index < 0 ? 0 : index;
    if (indexResolved >= this.steps.length) {
      return;
    }
    let prev: SpringSequenceFn = indexResolved === 0 ? this.initialSpring : stepSprinOrThrow(this.steps[index - 1]);
    for (let i = index; i < this.steps.length; i++) {
      const step = this.steps[i];
      const spring = this.createSpring(step.time, prev(step.time), step.config);
      step.spring = spring;
      prev = spring;
    }
  };

  /**
   * Create a spring at a certain time using defaultConfig
   */
  private readonly createSpring = (time: number, current: SpringResult | null, config: number | Partial<SpringConfig>): SpringFn => {
    const resolved = {
      ...this.defaultConfig,
      ...resolveConfig(config),
    };
    const conf: Partial<SpringConfig> = {
      // inject current state (position & velocity)
      ...(current ?? {}),
      // user config, note that user can override velocity and position by defining them in the config !
      ...resolved,
      // Override timeScale by the one defined in the SpringSequence
      timeScale: this.timeScale,
      // config.timeStart is used as an offset
      timeStart: time + (resolved.timeStart ?? 0),
    };
    return Spring(conf);
  };

  /**
   * Create an identical SpringSequence that does not depent on the source (safe to mutate)
   */
  public readonly clone = (): SpringSequence => {
    return new SpringSequence(
      this.steps.map((step) => ({ ...step })),
      { timeScale: this.timeScale, initial: this.initialSpring(0), defaultConfig: this.defaultConfig }
    );
  };

  public readonly setInitial = (initial: Partial<SpringResult>): this => {
    const current = this.initialSpring(0); // could fetch any time since initialSpring return the same value
    this.initialSpring = createInitialSpring({ position: initial.position ?? current.position, velocity: initial.velocity ?? current.velocity });
    this.updateFromIndex(0);
    return this;
  };

  public readonly setDefaultConfig = (config: Partial<SpringConfig>): this => {
    this.defaultConfig = config;
    this.updateFromIndex(0);
    return this;
  };

  public readonly setTimeScale = (timeScale: number): this => {
    this.timeScale = timeScale;
    this.updateFromIndex(0);
    return this;
  };

  /**
   * Insert a new step at the specified time
   */
  public readonly insertAt = (time: number, config: number | Partial<SpringConfig>): this => {
    const step = this.findMaybeStepAt(time);
    const newStep: SpringSequenceStep = { time, config: resolveConfig(config), spring: null };
    if (step === null) {
      // insert before all other steps
      this.steps.unshift(newStep);
      this.updateFromIndex(0);
      return this;
    }
    const stepIndex = this.steps.indexOf(step);
    // if time is the same, we replace the step
    const deletePrev = step.time === time;
    if (deletePrev) {
      this.steps.splice(stepIndex, 1, newStep);
      this.updateFromIndex(stepIndex);
      return this;
    }
    this.steps.splice(stepIndex + 1, 0, newStep);
    this.updateFromIndex(stepIndex + 1);
    return this;
  };

  /**
   * Add a new step and remove any step after it
   */
  public readonly replaceTail = (time: number, config: number | Partial<SpringConfig>): this => {
    const step = this.findMaybeStepAt(time);
    const stepIndex = step === null ? 0 : this.steps.indexOf(step);
    this.steps.splice(stepIndex, this.steps.length - stepIndex, { time, config: resolveConfig(config), spring: null });
    this.updateFromIndex(stepIndex);
    return this;
  };

  /**
   * Replace all the steps by the new one
   */
  public readonly replaceAll = (time: number, config: number | Partial<SpringConfig>): this => {
    this.steps.splice(0, this.steps.length, { time, config: resolveConfig(config), spring: null });
    this.updateFromIndex(0);
    return this;
  };

  /**
   * Decay at time and remove everything after
   */
  public readonly decay = (time: number, config: Partial<SpringConfig> = {}): this => {
    const stateAtTime = this.spring(time);
    const decayConf = SpringConfig.decay({ ...stateAtTime, ...config });
    const step = this.findMaybeStepAt(time);
    const stepIndex = step === null ? 0 : this.steps.indexOf(step);
    this.steps.splice(stepIndex, this.steps.length - stepIndex, { time, config: decayConf, spring: null });
    this.updateFromIndex(stepIndex);
    return this;
  };

  /**
   * Remove all steps before time
   */
  public readonly clearBefore = (time: number): this => {
    const step = this.findMaybeStepAt(time);
    if (step === null) {
      return this;
    }
    const stepIndex = this.steps.indexOf(step);
    const stateAtTime = stepSprinOrThrow(step)(time);
    this.steps.splice(0, stepIndex + 1);
    // this will update steps
    this.setInitial(stateAtTime);
    return this;
  };

  /**
   * Offset sequence by the specified time
   */
  public readonly offset = (offset: number): this => {
    this.steps.forEach((step) => {
      step.time = step.time + offset;
    });
    this.updateFromIndex(0);
    return this;
  };
}

function resolveConfig(conf: number | Partial<SpringConfig>): Partial<SpringConfig> {
  return typeof conf === 'number' ? { equilibrium: conf } : conf;
}

function stepSprinOrThrow(step: SpringSequenceStep): SpringSequenceFn {
  if (step.spring === null) {
    throw new Error(`Internal Error: steo.spring is null.`);
  }
  return step.spring;
}

function createInitialSpring(state: SpringResult): SpringSequenceFn {
  return Object.assign(() => state, {
    position: () => state.position,
    velocity: () => state.velocity,
  });
}
