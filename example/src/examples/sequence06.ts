import { SpringSequence } from '@humpf';

const sequence = SpringSequence.create({
  defaultConfig: { dampingRatio: 0.2 },
  initial: { position: 50, velocity: -50 },
}).insertAt(0, {});

export default sequence.spring;
