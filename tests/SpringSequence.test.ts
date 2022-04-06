import { SpringSequence } from '../src/mod';
import { canvasImage } from './utils';

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

test('SpringSequence insertAt', async () => {
  const seq = SpringSequence.create().insertAt(200, 100).insertAt(1000, 300).insertAt(2000, 0);
  expect(
    await canvasImage(seq.spring, 'sequence-insertAt', { timeAxis: [0, 4000], position: { min: 0, max: 350 }, velocity: { min: -120, max: 120 } })
  ).toMatchSnapshot();
});

test('SpringSequence replaceTail', async () => {
  const seq = SpringSequence.create().insertAt(200, 100).insertAt(1000, 300).insertAt(2000, 0).replaceTail(2300, 150);
  expect(
    await canvasImage(seq.spring, 'sequence-replaceTail', {
      timeAxis: [0, 4000],
      position: { min: 0, max: 350 },
      velocity: { min: -120, max: 120 },
      events: [{ time: 2300 }],
    })
  ).toMatchSnapshot();
});
