import { SpringConfig } from './SpringConfig';
import { SpringForT } from './types';
import { Spring } from './Spring';

type SpringConfigObj = typeof SpringConfig;

type SpringFromConfigObj = {
  [K in keyof SpringConfigObj]: (...args: Parameters<SpringConfigObj[K]>) => SpringForT;
};

export const SpringFromConfig: SpringFromConfigObj = Object.keys(SpringConfig).reduce<
  SpringFromConfigObj
>((acc, key) => {
  (acc as any)[key] = (...args: Array<any>) => Spring.create((SpringConfig as any)[key](...args));
  return acc;
}, {} as any);
