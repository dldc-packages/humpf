import { expect } from "@std/expect";
import { Spring, SpringConfig } from "../mod.ts";
import { matchCanvasImage } from "./utils.ts";

Deno.test("Create a spring does not throw", () => {
  expect(() => Spring()).not.toThrow();
});

Deno.test("Basic spring is working", async () => {
  const spring = Spring();
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  // almost there after 1 time unit
  expect(spring(1000)).toEqual({
    position: 0.98638916015625,
    velocity: 0.01171875,
  });
  expect(spring(2500)).toEqual({ position: 1, velocity: 0 });
  await matchCanvasImage(spring, "basic-spring", {
    timeAxis: [0, 3000],
    position: { min: 0, max: 1 },
    velocity: { min: -0.1, max: 0.5 },
  });
});

Deno.test("When dampingRatio=0 it goes back to position after 1 unit of time", async () => {
  const spring = Spring({
    timeScale: 1,
    position: 0,
    velocity: 0,
    equilibrium: 1,
    dampingRatio: 0,
  });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1)).toEqual({ position: 0, velocity: -0 });
  expect(spring(2)).toEqual({ position: 0, velocity: -0 });
  await matchCanvasImage(spring, "spring-bounce", {
    timeAxis: [0, 3],
    position: { min: 0, max: 2 },
  });
});

Deno.test("Spring position is the same as spring().position", () => {
  const spring = Spring();
  expect(spring.position(0)).toEqual(spring(0).position);
  expect(spring.position(300)).toEqual(spring(300).position);
  expect(spring.position(500)).toEqual(spring(500).position);
  expect(spring.position(1000)).toEqual(spring(1000).position);
});

Deno.test("Spring velocity is the same as spring().velocity", () => {
  const spring = Spring();
  expect(spring.velocity(0)).toEqual(spring(0).velocity);
  expect(spring.velocity(300)).toEqual(spring(300).velocity);
  expect(spring.velocity(500)).toEqual(spring(500).velocity);
  expect(spring.velocity(1000)).toEqual(spring(1000).velocity);
});

Deno.test("Equilibrium option", () => {
  const spring = Spring({ equilibrium: 200 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(500)).toEqual({
    position: 164.20513916015625,
    velocity: 27.152099609375,
  });
  expect(spring(1000)).toEqual({
    position: 197.27978515625,
    velocity: 2.3466796875,
  });
  expect(spring(2000)).toEqual({
    position: 199.99053955078125,
    velocity: 0.0087890625,
  });
  expect(spring(4000)).toEqual({ position: 200, velocity: 0 });
});

Deno.test("No angularFrequency is static", () => {
  const spring = Spring({ angularFrequency: 0 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(500)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1000)).toEqual({ position: 0, velocity: 0 });
});

Deno.test("Overdamped spring", async () => {
  const spring = Spring({ dampingRatio: 2, equilibrium: 100 });
  expect(spring(0)).toEqual({ position: 0, velocity: -0 });
  expect(spring(500)).toEqual({
    position: 53.57275390625,
    velocity: 12.43994140625,
  });
  expect(spring(1000)).toEqual({
    position: 79.99261474609375,
    velocity: 5.3609619140625,
  });
  expect(spring(2000)).toEqual({
    position: 96.284423828125,
    velocity: 0.99560546875,
  });
  expect(spring(1500).position).toEqual(spring.position(1500));
  expect(spring(1500).velocity).toEqual(spring.velocity(1500));
  await matchCanvasImage(spring, "spring-overdamped", {
    timeAxis: [0, 2500],
    position: { min: 0, max: 100 },
  });
});

Deno.test("Underdamped spring", async () => {
  const spring = Spring({ dampingRatio: 0.5, equilibrium: 100 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(200)).toEqual({
    position: 47.96124267578125,
    velocity: 54.56878662109375,
  });
  expect(spring(300)).toEqual({
    position: 79.9453125,
    velocity: 44.9088134765625,
  });
  expect(spring(400)).toEqual({
    position: 102.69720458984375,
    velocity: 27.016357421875,
  });
  expect(spring(500)).toEqual({
    position: 114.0699462890625,
    velocity: 9.80743408203125,
  });
  expect(spring(1000)).toEqual({
    position: 98.98223876953125,
    velocity: -3.7216796875,
  });
  expect(spring(2000)).toEqual({
    position: 100.128173828125,
    velocity: -0.2142333984375,
  });
  expect(spring(1500).position).toEqual(spring.position(1500));
  expect(spring(1500).velocity).toEqual(spring.velocity(1500));
  await matchCanvasImage(spring, "spring-underdamped", {
    timeAxis: [0, 2500],
    position: { min: 0, max: 150 },
  });
});

Deno.test("TimeStart option", async () => {
  const spring = Spring({ timeStart: 1000, equilibrium: 100 });
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(500)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1000)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1250)).toEqual({
    position: 46.55841064453125,
    velocity: 32.65362548828125,
  });
  expect(spring(1500)).toEqual({
    position: 82.1025390625,
    velocity: 13.5760498046875,
  });
  expect(spring(2000)).toEqual({
    position: 98.639892578125,
    velocity: 1.17333984375,
  });
  await matchCanvasImage(spring, "spring-delay", {
    timeAxis: [0, 2500],
    position: { min: 0, max: 100 },
  });
});

Deno.test("Negative timeStart option", async () => {
  const spring = Spring({ timeStart: -500, equilibrium: 100 });
  expect(spring(-500)).toEqual({ position: 0, velocity: 0 });
  expect(spring(-200)).toEqual({
    position: 56.196044921875,
    velocity: 28.620361328125,
  });
  expect(spring(0)).toEqual({
    position: 82.1025390625,
    velocity: 13.5760498046875,
  });
  expect(spring(500)).toEqual({
    position: 98.639892578125,
    velocity: 1.17333984375,
  });
  await matchCanvasImage(spring, "spring-negative-delay", {
    timeAxis: [-500, 500],
    position: { min: 0, max: 100 },
    events: [{ time: 0 }],
  });
});

Deno.test("Decay", async () => {
  const spring = Spring(SpringConfig.decay({ velocity: 5 }));
  expect(spring(0)).toEqual({ position: 0, velocity: 5 });
  expect(spring(250)).toEqual({
    position: 3.96063232421875,
    velocity: 1.03936767578125,
  });
  expect(spring(500)).toEqual({
    position: 4.783935546875,
    velocity: 0.216064453125,
  });
  expect(spring(1000)).toEqual({
    position: 4.99066162109375,
    velocity: 0.00933837890625,
  });
  expect(spring(2000)).toEqual({ position: 5, velocity: 0 });
  await matchCanvasImage(spring, "spring-decay", {
    timeAxis: [0, 2000],
    position: { min: 0, max: 5 },
    velocity: { min: 0, max: 5 },
  });
});

Deno.test("Identity spring", async () => {
  const spring = Spring({ angularFrequency: 0.0000000001 });
  expect(spring.position(0)).toEqual(0);
  expect(spring.position(1000)).toEqual(0);
  expect(spring.velocity(0)).toEqual(0);
  expect(spring.velocity(1000)).toEqual(0);
  expect(spring(0)).toEqual({ position: 0, velocity: 0 });
  expect(spring(1000)).toEqual({ position: 0, velocity: 0 });
  await matchCanvasImage(spring, "spring-identity", {
    timeAxis: [0, 1000],
    position: { min: -1, max: 1 },
  });
});

Deno.test("Stable spring", () => {
  const spring = Spring({
    position: 100,
    equilibrium: 100,
    velocity: 0.000000000001,
  });
  expect(spring.position(0)).toEqual(100);
  expect(spring.position(1000)).toEqual(100);
  expect(spring.velocity(0)).toEqual(0.000000000001);
  expect(spring.velocity(1000)).toEqual(0.000000000001);
});

Deno.test("Throw if angular frequency is less than 0", () => {
  expect(() => Spring({ angularFrequency: 0 })).not.toThrow();
  expect(() => Spring({ angularFrequency: -1 })).toThrow();
});

Deno.test("Throw if angular dampingRatio is less than 0", () => {
  expect(() => Spring({ dampingRatio: 0 })).not.toThrow();
  expect(() => Spring({ dampingRatio: -1 })).toThrow();
});
