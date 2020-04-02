export interface SpringResult {
  pos: number;
  vel: number;
}

export type SpringForT = (t: number) => SpringResult;
