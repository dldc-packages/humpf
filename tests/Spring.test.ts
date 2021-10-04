import { Spring, SpringConfig } from '../src/mod';

test('Create a spring does not throw', () => {
  expect(() => Spring()).not.toThrow();
});

test('Basic spring is working', () => {
  const spring = Spring();
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(300)).toEqual({ position: 80.08517265285442, velocity: 14.936120510359183 });
  expect(spring(500)).toEqual({ position: 95.95723180054873, velocity: 3.368973499542734 });
  expect(spring(1000)).toEqual({ position: 99.95006007726127, velocity: 0.045399929762484845 });
});

test('Spring position is the same as spring().position', () => {
  const spring = Spring();
  expect(spring.position(0)).toEqual(spring(0).position);
  expect(spring.position(300)).toEqual(spring(300).position);
  expect(spring.position(500)).toEqual(spring(500).position);
  expect(spring.position(1000)).toEqual(spring(1000).position);
});

test('Spring velocity is the same as spring().velocity', () => {
  const spring = Spring();
  expect(spring.velocity(0)).toEqual(spring(0).velocity);
  expect(spring.velocity(300)).toEqual(spring(300).velocity);
  expect(spring.velocity(500)).toEqual(spring(500).velocity);
  expect(spring.velocity(1000)).toEqual(spring(1000).velocity);
});

test('Equilibrium option', () => {
  const spring = Spring({ equilibrium: 200 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(500)).toEqual({ position: 191.91446360109745, velocity: 6.737946999085468 });
  expect(spring(1000)).toEqual({ position: 199.90012015452254, velocity: 0.09079985952496969 });
});

test('No angularFrequency is static', () => {
  const spring = Spring({ angularFrequency: 0 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(500)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1000)).toEqual({ position: 0, velocity: 0 });
});

test('Overdamped spring', () => {
  const spring = Spring({ dampingRatio: 2 });
  expect(spring(0)).toEqual({ position: 0, velocity: -5.949667257334986e-15 });
  expect(spring(500)).toEqual({ position: 71.78288260248469, velocity: 7.560753608532153 });
  expect(spring(1000)).toEqual({ position: 92.60959280903771, velocity: 1.980253638555507 });
  expect(spring(2000)).toEqual({ position: 99.49303286024785, velocity: 0.13584143568570428 });
  expect(spring(1500).position).toEqual(spring.position(1500));
  expect(spring(1500).velocity).toEqual(spring.velocity(1500));
});

test('Underdamped spring', () => {
  const spring = Spring({ dampingRatio: 0.5 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(200)).toEqual({ position: 84.94256348541123, velocity: 41.92796296663318 });
  expect(spring(300)).toEqual({ position: 112.43547674084118, velocity: 13.324264401804115 });
  expect(spring(400)).toEqual({ position: 115.31227684140492, velocity: -4.952987974191479 });
  expect(spring(500)).toEqual({ position: 107.45905665950333, velocity: -8.794242073251285 });
  expect(spring(1000)).toEqual({ position: 100.21701167393262, velocity: 0.5385480616059573 });
  expect(spring(2000)).toEqual({ position: 100.00242939948036, velocity: -0.005237764473440873 });
  expect(spring(1500).position).toEqual(spring.position(1500));
  expect(spring(1500).velocity).toEqual(spring.velocity(1500));
});

test('TimeStart option', () => {
  const spring = Spring({ timeStart: 1000 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(500)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1000)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1500)).toEqual({ position: 95.95723180054873, velocity: 3.368973499542734 });
  expect(spring(2000)).toEqual({ position: 99.95006007726127, velocity: 0.045399929762484845 });
});

test('Negative timeStart option', () => {
  const spring = Spring({ timeStart: -500 });
  expect(spring(-500)).toEqual({ position: 0, velocity: 0 });
  expect(spring(-200)).toEqual({ position: 80.08517265285442, velocity: 14.936120510359183 });
  expect(spring(0)).toEqual({ position: 95.95723180054873, velocity: 3.368973499542734 });
  expect(spring(500)).toEqual({ position: 99.95006007726127, velocity: 0.045399929762484845 });
});

test('Decay', () => {
  const spring = Spring(SpringConfig.decay({ velocity: 5 }));
  expect(spring(0)).toEqual({ position: 0, velocity: 5 });
  expect(spring(250)).toEqual({ position: 4.589575006880506, velocity: 0.4104249931194941 });
  expect(spring(500)).toEqual({ position: 4.966310265004573, velocity: 0.03368973499542732 });
  expect(spring(1000)).toEqual({ position: 4.999773000351188, velocity: 0.00022699964881242422 });
});

test('Identity spring', () => {
  const spring = Spring({ angularFrequency: 0.0000000001 });
  expect(spring.position(0)).toEqual(0);
  expect(spring.position(1000)).toEqual(0);
  expect(spring.velocity(0)).toEqual(0);
  expect(spring.velocity(1000)).toEqual(0);
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1000)).toEqual({ position: 0, velocity: 0 });
});

test('Stable spring', () => {
  const spring = Spring({ position: 100, equilibrium: 100, velocity: 0.000000000001 });
  expect(spring.position(0)).toEqual(100);
  expect(spring.position(1000)).toEqual(100);
  expect(spring.velocity(0)).toEqual(0.000000000001);
  expect(spring.velocity(1000)).toEqual(0.000000000001);
});

test('Throw if angular frequency is less than 0', () => {
  expect(() => Spring({ angularFrequency: 0 })).not.toThrow();
  expect(() => Spring({ angularFrequency: -1 })).toThrow();
});

test('Throw if angular dampingRatio is less than 0', () => {
  expect(() => Spring({ dampingRatio: 0 })).not.toThrow();
  expect(() => Spring({ dampingRatio: -1 })).toThrow();
});
