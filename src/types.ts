export interface ISpringConfig {
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

export interface ISpringResult {
  position: number;
  velocity: number;
}

export interface ISpringFn {
  (t: number): ISpringResult;
  readonly position: (t: number) => number;
  readonly velocity: (t: number) => number;
  // returns true if the spring is stable at time t
  // i.e. position === equilibrium && velocity === 0
  readonly stable: (t: number) => boolean;
  readonly config: Readonly<Partial<ISpringConfig>>;
}

export interface ISpringSequenceConfig {
  timeScale?: number;
  defaultConfig?: Partial<ISpringConfig>;
  initial?: Partial<ISpringConfig>;
}

export interface ISpringSequence {
  readonly spring: ISpringFn;

  clone(): ISpringSequence;
  setInitial(initial: Partial<ISpringConfig>): ISpringSequence;
  setDefaultConfig(config: Partial<ISpringConfig>): ISpringSequence;
  setTimeScale(timeScale: number): ISpringSequence;
  insertAt(
    time: number,
    config: number | Partial<ISpringConfig>,
  ): ISpringSequence;
  replaceTail(
    time: number,
    config: number | Partial<ISpringConfig>,
  ): ISpringSequence;
  replaceAll(
    time: number,
    config: number | Partial<ISpringConfig>,
  ): ISpringSequence;
  decay(time: number, config?: Partial<ISpringConfig>): ISpringSequence;
  clearBefore(time: number): ISpringSequence;
  offset(offset: number): ISpringSequence;
}
