import { Spring } from './Spring';
import { invariant } from './utils';

export interface SpringConfig {
  position: number; // initial velocity
  velocity: number; // initial velocity
  equilibrium: number; // position to approach
  angularFrequency: number; // angular frequency of motion
  dampingRatio: number; // damping ratio of motion
}

export const SpringConfig = {
  decay,
  decayFrom
};

function decayFrom(position: number, velocity: number, angularFrequency: number = 0): SpringConfig {
  invariant(angularFrequency >= 0, 'Angular Frequency must be >= 0');

  const equilibrium = position + Spring.findEquilibrium(velocity, angularFrequency);
  return {
    position: 0,
    velocity,
    dampingRatio: 1,
    equilibrium,
    angularFrequency
  };
}

function decay(velocity: number, angularFrequency: number = 0): SpringConfig {
  return decayFrom(0, velocity, angularFrequency);
}
