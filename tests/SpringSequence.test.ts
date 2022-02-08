import { SpringSequence } from '../src/mod';
import { asciiGraph } from './utils';

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

test('SpringSequence insertAt', () => {
  const seq = SpringSequence.create().insertAt(200, 100).insertAt(1000, 300).insertAt(2000, 0);
  expect(asciiGraph(seq.spring.position, { width: 100, height: 10, xAxis: [0, 4000], yAxis: [0, 350] })).toMatchInlineSnapshot(`
    "____________________________________________________________________________________________________
    ______________________________________███████████████_______________________________________________
    __________________________________████_______________█______________________________________________
    ________________________________██____________________█_____________________________________________
    ______________________________██_______________________██___________________________________________
    ____________________________██___________________________█__________________________________________
    ____________________████████______________________________██________________________________________
    _____________███████________________________________________███_____________________________________
    _________████__________________________________________________██████_______________________________
    █████████____________________________________________________________███████████████████████████████"
  `);
});
