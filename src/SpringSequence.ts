import type { SpringFn, SpringResult } from './Spring';
import { Spring } from './Spring';
import type { ISpringConfig } from './SpringConfig';
import { DEFAULT_TIME_SCALE, SpringConfig } from './SpringConfig';
import { makeSpringFn } from './utils';

type SpringSequenceStep = { time: number; config: Partial<ISpringConfig>; spring: SpringFn | null };

export interface SpringSequenceConfig {
  timeScale?: number;
  defaultConfig?: Partial<ISpringConfig>;
  initial?: Partial<ISpringConfig>;
}

export interface ISpringSequence {
  readonly spring: SpringFn;

  clone(): ISpringSequence;
  setInitial(initial: Partial<ISpringConfig>): ISpringSequence;
  setDefaultConfig(config: Partial<ISpringConfig>): ISpringSequence;
  setTimeScale(timeScale: number): ISpringSequence;
  insertAt(time: number, config: number | Partial<ISpringConfig>): ISpringSequence;
  replaceTail(time: number, config: number | Partial<ISpringConfig>): ISpringSequence;
  replaceAll(time: number, config: number | Partial<ISpringConfig>): ISpringSequence;
  decay(time: number, config?: Partial<ISpringConfig>): ISpringSequence;
  clearBefore(time: number): ISpringSequence;
  offset(offset: number): ISpringSequence;
}

export const SpringSequence = (() => {
  return { create };

  function create(options: SpringSequenceConfig = {}): ISpringSequence {
    return createInternal([], options);
  }

  function createInternal(steps: Array<SpringSequenceStep>, config: SpringSequenceConfig): ISpringSequence {
    let timeScale: number = config.timeScale ?? DEFAULT_TIME_SCALE;
    let defaultConfig: Partial<ISpringConfig> = config.defaultConfig ?? {};
    // const that return initial state at any time
    let initialSpring: SpringFn = Spring({ ...defaultConfig, ...resolveInitialConfig(config.initial ?? {}) });
    const spring: SpringFn = makeSpringFn(
      defaultConfig,
      (t) => findSpringAt(t)(t),
      (t) => findSpringAt(t).position(t),
      (t) => findSpringAt(t).velocity(t),
      (t) => findSpringAt(t).stable(t),
    );

    const seq: ISpringSequence = {
      spring,
      clone,
      setInitial,
      setDefaultConfig,
      setTimeScale,
      insertAt,
      replaceTail,
      replaceAll,
      decay,
      clearBefore,
      offset,
    };

    return seq;

    function findSpringAt(t: number): SpringFn {
      const step = findMaybeStepAt(t);
      if (step) {
        return stepSpringOrThrow(step);
      }
      return initialSpring;
    }

    /**
     * Return the first step where t is >= to step.time
     * Return null if t is before first step or no steps
     */
    function findMaybeStepAt(t: number): SpringSequenceStep | null {
      if (steps.length === 0) {
        return null;
      }
      if (t < steps[0].time) {
        // t is before first time
        return null;
      }
      let prev: null | SpringSequenceStep = null;
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (t < step.time) {
          break;
        }
        prev = step;
      }
      return prev;
    }

    /**
     * On initial config, if only one of position or equilibrium is defined,
     * we set the other one to the same value.
     */
    function resolveInitialConfig(initial: Partial<ISpringConfig>): Partial<ISpringConfig> {
      if (initial.position === undefined && initial.equilibrium === undefined) {
        return { ...initial, position: 0, equilibrium: 0 };
      }
      if (initial.position === undefined && initial.equilibrium !== undefined) {
        return { ...initial, position: initial.equilibrium };
      }
      if (initial.position !== undefined && initial.equilibrium === undefined) {
        return { ...initial, equilibrium: initial.position };
      }
      return initial;
    }

    /**
     * Update each step starting at the index
     */
    function updateFromIndex(index: number): void {
      const indexResolved = index < 0 ? 0 : index;
      if (indexResolved >= steps.length) {
        return;
      }
      let prev: SpringFn = indexResolved === 0 ? initialSpring : stepSpringOrThrow(steps[index - 1]);
      for (let i = index; i < steps.length; i++) {
        const step = steps[i];
        const spring = createSpring(step.time, prev(step.time), step.config);
        step.spring = spring;
        prev = spring;
      }
    }

    /**
     * Create a spring at a certain time using defaultConfig
     */
    function createSpring(
      time: number,
      current: SpringResult | null,
      config: number | Partial<ISpringConfig>,
    ): SpringFn {
      const resolved = {
        ...defaultConfig,
        ...resolveConfig(config),
      };
      const conf: Partial<ISpringConfig> = {
        // inject current state (position & velocity)
        ...(current ?? {}),
        // user config, note that user can override velocity and position by defining them in the config !
        ...resolved,
        // Override timeScale by the one defined in the SpringSequence
        timeScale: timeScale,
        // config.timeStart is used as an offset
        timeStart: time + (resolved.timeStart ?? 0),
      };
      return Spring(conf);
    }

    /**
     * Create an identical SpringSequence that does not depent on the source (safe to mutate)
     */
    function clone(): ISpringSequence {
      return createInternal(
        steps.map((step) => ({ ...step })),
        { timeScale: timeScale, initial: initialSpring(0), defaultConfig: defaultConfig },
      );
    }

    /**
     * Change the initial state of the spring.
     * This will update all internal springs.
     */
    function setInitial(initial: Partial<ISpringConfig>): ISpringSequence {
      initialSpring = Spring({ ...defaultConfig, ...resolveInitialConfig(initial) });
      updateFromIndex(0);
      return seq;
    }

    /**
     * Change the default config. This will update all internal springs.
     */
    function setDefaultConfig(config: Partial<ISpringConfig>): ISpringSequence {
      defaultConfig = config;
      updateFromIndex(0);
      return seq;
    }

    /**
     * Change timescale
     */
    function setTimeScale(newTimeScale: number): ISpringSequence {
      timeScale = newTimeScale;
      updateFromIndex(0);
      return seq;
    }

    /**
     * Insert a new step at the specified time
     */
    function insertAt(time: number, config: number | Partial<ISpringConfig>): ISpringSequence {
      const step = findMaybeStepAt(time);
      const newStep: SpringSequenceStep = { time, config: resolveConfig(config), spring: null };
      if (step === null) {
        // insert before all other steps
        steps.unshift(newStep);
        updateFromIndex(0);
        return seq;
      }
      const stepIndex = steps.indexOf(step);
      // if time is the same, we replace the step
      const deletePrev = step.time === time;
      if (deletePrev) {
        steps.splice(stepIndex, 1, newStep);
        updateFromIndex(stepIndex);
        return seq;
      }
      steps.splice(stepIndex + 1, 0, newStep);
      updateFromIndex(stepIndex + 1);
      return seq;
    }

    /**
     * Add a new step and remove any step after it
     */
    function replaceTail(time: number, config: number | Partial<ISpringConfig>): ISpringSequence {
      const step = findMaybeStepAt(time);
      const stepIndex = step === null ? 0 : steps.indexOf(step);
      steps.splice(stepIndex + 1, steps.length - stepIndex, { time, config: resolveConfig(config), spring: null });
      updateFromIndex(stepIndex);
      return seq;
    }

    /**
     * Replace all the steps by the new one
     */
    function replaceAll(time: number, config: number | Partial<ISpringConfig>): ISpringSequence {
      steps.splice(0, steps.length, { time, config: resolveConfig(config), spring: null });
      updateFromIndex(0);
      return seq;
    }

    /**
     * Decay at time and remove everything after
     */
    function decay(time: number, config: Partial<ISpringConfig> = {}): ISpringSequence {
      const stateAtTime = spring(time);
      const decayConf = SpringConfig.decay({ ...stateAtTime, ...config });
      const step = findMaybeStepAt(time);
      const stepIndex = step === null ? 0 : steps.indexOf(step);
      steps.splice(stepIndex, steps.length - stepIndex, { time, config: decayConf, spring: null });
      updateFromIndex(stepIndex);
      return seq;
    }

    /**
     * Remove all steps before time
     */
    function clearBefore(time: number): ISpringSequence {
      const step = findMaybeStepAt(time);
      if (step === null) {
        return seq;
      }
      const stepIndex = steps.indexOf(step);
      const stateAtTime = stepSpringOrThrow(step)(time);
      steps.splice(0, stepIndex + 1);
      // this will update steps
      setInitial(stateAtTime);
      return seq;
    }

    /**
     * Offset sequence by the specified time
     */
    function offset(offset: number): ISpringSequence {
      steps.forEach((step) => {
        step.time = step.time + offset;
      });
      updateFromIndex(0);
      return seq;
    }
  }
})();

function resolveConfig(conf: number | Partial<ISpringConfig>): Partial<ISpringConfig> {
  return typeof conf === 'number' ? { equilibrium: conf } : conf;
}

function stepSpringOrThrow(step: SpringSequenceStep): SpringFn {
  if (step.spring === null) {
    throw new Error(`Internal Error: step.spring is null.`);
  }
  return step.spring;
}
