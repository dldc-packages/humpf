import { SpringSequence } from '../src/mod';

test('Empty SpringSequence', () => {
  const seq = SpringSequence.create();
  [0, 100, 500, 1000, 2000].forEach((time) => {
    expect(seq.spring(time)).toEqual({ position: 0, velocity: 0 });
    expect(seq.spring.position(time)).toEqual(0);
    expect(seq.spring.velocity(time)).toEqual(0);
  });
});

test('Create with empty options', () => {
  const seq = SpringSequence.create({});
  [0, 100, 500, 1000, 2000].forEach((time) => {
    expect(seq.spring(time)).toEqual({ position: 0, velocity: 0 });
    expect(seq.spring.position(time)).toEqual(0);
    expect(seq.spring.velocity(time)).toEqual(0);
  });
});

test('Create with initial', () => {
  const seq = SpringSequence.create({ initial: { position: 100, velocity: 0 } });
  [0, 100, 500, 1000, 2000].forEach((time) => {
    expect(seq.spring(time)).toEqual({ position: 100, velocity: 0 });
    expect(seq.spring.position(time)).toEqual(100);
    expect(seq.spring.velocity(time)).toEqual(0);
  });
});

test('Create with initial', () => {
  const seq = SpringSequence.create({ initial: { position: 100, velocity: 0 } });
  [0, 100, 500, 1000, 2000].forEach((time) => {
    expect(seq.spring(time)).toEqual({ position: 100, velocity: 0 });
    expect(seq.spring.position(time)).toEqual(100);
    expect(seq.spring.velocity(time)).toEqual(0);
  });
});

test('Create with initial velocity', () => {
  const seq = SpringSequence.create({ initial: { position: 100, velocity: 100 } });
  expect(seq.spring(500)).toEqual({ position: 100, velocity: 100 });
});
