import { SpringSequence } from '@humpf';

const sequence = SpringSequence.create({
  defaultConfig: { dampingRatio: 0.4, angularFrequency: 0.5 },
})
  .insertAt(0, { equilibrium: 100 })
  .insertAt(500, { equilibrium: -100 })
  .insertAt(1000, { equilibrium: 100 })
  .insertAt(3000, { equilibrium: -100 })
  .insertAt(3500, { equilibrium: 100 })
  .insertAt(4000, { equilibrium: 0 });

export default sequence.spring;
