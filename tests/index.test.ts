import { Spring, SpringConfig } from '../src';

test('Create a spring does not throw', () => {
  expect(() => Spring()).not.toThrow();
});

test('Basic spring is working', () => {
  const spring = Spring();
  expect(spring(0)).toEqual({ pos: 0, vel: 0 });
  expect(spring(300)).toEqual({ pos: 80.08517265285442, vel: 14.936120510359183 });
  expect(spring(500)).toEqual({ pos: 95.95723180054873, vel: 3.368973499542734 });
  expect(spring(1000)).toEqual({ pos: 99.95006007726127, vel: 0.045399929762484845 });
});

test('Equilibrium option', () => {
  const spring = Spring({ equilibrium: 200 });
  expect(spring(0)).toEqual({ pos: 0, vel: 0 });
  expect(spring(500)).toEqual({ pos: 191.91446360109745, vel: 6.737946999085468 });
  expect(spring(1000)).toEqual({ pos: 199.90012015452254, vel: 0.09079985952496969 });
});

test('No angularFrequency is static', () => {
  const spring = Spring({ angularFrequency: 0 });
  expect(spring(0)).toEqual({ pos: 0, vel: 0 });
  expect(spring(500)).toEqual({ pos: 0, vel: 0 });
  expect(spring(1000)).toEqual({ pos: 0, vel: 0 });
});

test('Overdamped spring', () => {
  const spring = Spring({ dampingRatio: 2 });
  expect(spring(0)).toEqual({ pos: 0, vel: -5.949667257334986e-15 });
  expect(spring(500)).toEqual({ pos: 71.78288260248469, vel: 7.560753608532153 });
  expect(spring(1000)).toEqual({ pos: 92.60959280903771, vel: 1.980253638555507 });
  expect(spring(2000)).toEqual({ pos: 99.49303286024785, vel: 0.13584143568570428 });
});

test('Underdamped spring', () => {
  const spring = Spring({ dampingRatio: 0.5 });
  expect(spring(0)).toEqual({ pos: 0, vel: 0 });
  expect(spring(200)).toEqual({ pos: 84.94256348541123, vel: 41.92796296663318 });
  expect(spring(300)).toEqual({ pos: 112.43547674084118, vel: 13.324264401804115 });
  expect(spring(400)).toEqual({ pos: 115.31227684140492, vel: -4.952987974191479 });
  expect(spring(500)).toEqual({ pos: 107.45905665950333, vel: -8.794242073251285 });
  expect(spring(1000)).toEqual({ pos: 100.21701167393262, vel: 0.5385480616059573 });
  expect(spring(2000)).toEqual({ pos: 100.00242939948036, vel: -0.005237764473440873 });
});

test('TimeStart option', () => {
  const spring = Spring({ timeStart: 1000 });
  expect(spring(0)).toEqual({ pos: 0, vel: 0 });
  expect(spring(500)).toEqual({ pos: 0, vel: 0 });
  expect(spring(1000)).toEqual({ pos: 0, vel: 0 });
  expect(spring(1500)).toEqual({ pos: 95.95723180054873, vel: 3.368973499542734 });
  expect(spring(2000)).toEqual({ pos: 99.95006007726127, vel: 0.045399929762484845 });
});

test('Negative timeStart option', () => {
  const spring = Spring({ timeStart: -500 });
  expect(spring(-500)).toEqual({ pos: 0, vel: 0 });
  expect(spring(-200)).toEqual({ pos: 80.08517265285442, vel: 14.936120510359183 });
  expect(spring(0)).toEqual({ pos: 95.95723180054873, vel: 3.368973499542734 });
  expect(spring(500)).toEqual({ pos: 99.95006007726127, vel: 0.045399929762484845 });
});

test('Decay', () => {
  const spring = Spring(SpringConfig.decay({ velocity: 5 }));
  expect(spring(0)).toEqual({ pos: 0, vel: 5 });
  expect(spring(250)).toEqual({ pos: 4.589575006880506, vel: 0.4104249931194941 });
  expect(spring(500)).toEqual({ pos: 4.966310265004573, vel: 0.03368973499542732 });
  expect(spring(1000)).toEqual({ pos: 4.999773000351188, vel: 0.00022699964881242422 });
});
