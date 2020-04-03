export interface SpringResult {
  pos: number;
  vel: number;
}

export interface SpringConfig {
  position: number; // initial velocity
  velocity: number; // initial velocity
  equilibrium: number; // position to approach
  angularFrequency: number; // angular frequency of motion
  dampingRatio: number; // damping ratio of motion
  timeScale: number; // multiply time by this value
  timeStart: number; // time at which the annimation should start (after timeScale)
}

export type SpringFn = (t: number) => SpringResult;
