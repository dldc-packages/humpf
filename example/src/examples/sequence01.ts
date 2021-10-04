import { SpringSequence } from '@humpf';

const sequence = SpringSequence.create()
  .insertAt(0, { position: 0, equilibrium: 100, angularFrequency: 0.5 })
  .insertAt(800, { equilibrium: 0, angularFrequency: 0.5 });

export default sequence.spring;
