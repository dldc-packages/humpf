import { SpringSequence } from '@humpf';

const sequence = SpringSequence.create({
  defaultConfig: { dampingRatio: 0.6, angularFrequency: 0.9 },
})
  .insertAt(0, { equilibrium: 100 })
  .insertAt(1000, { equilibrium: 200 })
  .insertAt(2000, { equilibrium: 300 })
  .insertAt(3000, { equilibrium: 400 });

export default sequence.spring;
