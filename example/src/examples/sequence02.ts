import { SpringSequence } from '@humpf';

const sequence = SpringSequence.create({ defaultConfig: { angularFrequency: 0.5 } })
  .insertAt(0, { equilibrium: 100 })
  .insertAt(500, { equilibrium: 100, position: 0, velocity: 0 });

export default sequence.spring;
