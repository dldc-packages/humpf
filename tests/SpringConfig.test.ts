import { expect } from "@std/expect";
import { SpringConfig } from "../mod.ts";

Deno.test("SpringConfig.stable config cannot override equilibrium, position & velocity", () => {
  const staticConf = SpringConfig.stable(200, {
    equilibrium: 100,
    position: 100,
    velocity: 100,
  });
  expect(staticConf.equilibrium).toBe(200);
  expect(staticConf.position).toBe(200);
  expect(staticConf.velocity).toBe(0);
});

Deno.test("SpringConfig.basic", () => {
  expect(SpringConfig.basic()).toEqual({
    angularFrequency: 1,
    dampingRatio: 1,
  });
  expect(SpringConfig.basic({ equilibrium: 200 })).toEqual({
    angularFrequency: 1,
    dampingRatio: 1,
    equilibrium: 200,
  });
});

Deno.test("SpringConfig.stable", () => {
  const staticConf = SpringConfig.stable(200);
  expect(staticConf.equilibrium).toBe(200);
  expect(staticConf.position).toBe(staticConf.equilibrium);
  expect(staticConf.velocity).toBe(0);
});

Deno.test("SpringConfig.gentle", () => {
  expect(SpringConfig.gentle()).toEqual({
    angularFrequency: 0.6,
    dampingRatio: 0.6,
  });
  expect(SpringConfig.gentle({ equilibrium: 200 })).toEqual({
    angularFrequency: 0.6,
    dampingRatio: 0.6,
    equilibrium: 200,
  });
});

Deno.test("SpringConfig.defaults", () => {
  expect(SpringConfig.defaults({})).toEqual({
    angularFrequency: 1,
    dampingRatio: 1,
    equilibrium: 1,
    position: 0,
    timeStart: 0,
    velocity: 0,
    timeScale: 1000,
    positionPrecision: 0.00006103515625,
    velocityPrecision: 0.00006103515625,
    dampingRatioPrecision: 0.00006103515625,
  });
  expect(SpringConfig.defaults()).toEqual({
    angularFrequency: 1,
    dampingRatio: 1,
    equilibrium: 1,
    position: 0,
    timeStart: 0,
    velocity: 0,
    timeScale: 1000,
    positionPrecision: 0.00006103515625,
    velocityPrecision: 0.00006103515625,
    dampingRatioPrecision: 0.00006103515625,
  });
  expect(SpringConfig.defaults({ position: 200 })).toEqual({
    angularFrequency: 1,
    dampingRatio: 1,
    equilibrium: 1,
    position: 200,
    timeStart: 0,
    velocity: 0,
    timeScale: 1000,
    positionPrecision: 0.00006103515625,
    velocityPrecision: 0.00006103515625,
    dampingRatioPrecision: 0.00006103515625,
  });
});

Deno.test("SpringConfig.slow", () => {
  expect(SpringConfig.slow()).toEqual({
    angularFrequency: 0.5,
    dampingRatio: 1,
  });
  expect(SpringConfig.slow({ equilibrium: 200 })).toEqual({
    angularFrequency: 0.5,
    dampingRatio: 1,
    equilibrium: 200,
  });
});

Deno.test("SpringConfig.stiff", () => {
  expect(SpringConfig.stiff()).toEqual({
    angularFrequency: 1.1,
    dampingRatio: 0.7,
  });
  expect(SpringConfig.stiff({ equilibrium: 200 })).toEqual({
    angularFrequency: 1.1,
    dampingRatio: 0.7,
    equilibrium: 200,
  });
});

Deno.test("SpringConfig.wobbly", () => {
  expect(SpringConfig.wobbly()).toEqual({
    angularFrequency: 0.8,
    dampingRatio: 0.4,
  });
  expect(SpringConfig.wobbly({ equilibrium: 200 })).toEqual({
    angularFrequency: 0.8,
    dampingRatio: 0.4,
    equilibrium: 200,
  });
});

Deno.test("SpringConfig.decay", () => {
  expect(SpringConfig.decay()).toEqual({ dampingRatio: 1, equilibrium: 0 });
  expect(SpringConfig.decay({ position: 400 })).toEqual({
    dampingRatio: 1,
    equilibrium: 400,
    position: 400,
  });
  expect(SpringConfig.decay({ position: 400, velocity: -30 })).toEqual({
    dampingRatio: 1,
    velocity: -30,
    equilibrium: 370,
    position: 400,
  });
});

Deno.test("SpringConfig.findEquilibrium", () => {
  expect(SpringConfig.findEquilibrium(0)).toEqual(0);
  expect(SpringConfig.findEquilibrium(10)).toEqual(10);
  expect(SpringConfig.findEquilibrium(10, 0.5)).toEqual(20);
});

Deno.test("SpringConfig.angularFrequencyFromMass", () => {
  expect(SpringConfig.angularFrequencyFromMass(10)).toEqual(
    0.31622776601683794,
  );
  expect(SpringConfig.angularFrequencyFromMass(5)).toEqual(0.4472135954999579);
  expect(SpringConfig.angularFrequencyFromMass(10, 2)).toEqual(
    0.4472135954999579,
  );
  expect(SpringConfig.angularFrequencyFromMass(5, 2)).toEqual(
    0.6324555320336759,
  );
});

Deno.test("SpringConfig.angularFrequencyFromSpringConstant", () => {
  expect(SpringConfig.angularFrequencyFromSpringConstant(1)).toEqual(1);
  expect(SpringConfig.angularFrequencyFromSpringConstant(2)).toEqual(
    1.4142135623730951,
  );
  expect(SpringConfig.angularFrequencyFromSpringConstant(1, 10)).toEqual(
    0.31622776601683794,
  );
  expect(SpringConfig.angularFrequencyFromSpringConstant(2, 10)).toEqual(
    0.4472135954999579,
  );
});
