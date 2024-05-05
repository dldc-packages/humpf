import { expect } from "$std/expect/mod.ts";
import { SpringSequence } from "../mod.ts";
import { matchCanvasImage } from "./utils.ts";

Deno.test("Empty SpringSequence", () => {
  const seq = SpringSequence();
  [0, 100, 500, 1000, 2000].forEach((time) => {
    expect(seq.spring(time)).toEqual({ position: 0, velocity: 0 });
    expect(seq.spring.position(time)).toEqual(0);
    expect(seq.spring.velocity(time)).toEqual(0);
  });
});

Deno.test("Create with empty options", () => {
  const seq = SpringSequence({});
  [0, 100, 500, 1000, 2000].forEach((time) => {
    expect(seq.spring(time)).toEqual({ position: 0, velocity: 0 });
    expect(seq.spring.position(time)).toEqual(0);
    expect(seq.spring.velocity(time)).toEqual(0);
  });
});

Deno.test("Create with initial", () => {
  const seq = SpringSequence({
    initial: { position: 100, velocity: 0 },
  });
  [0, 100, 500, 1000, 2000].forEach((time) => {
    expect(seq.spring(time)).toEqual({ position: 100, velocity: 0 });
    expect(seq.spring.position(time)).toEqual(100);
    expect(seq.spring.velocity(time)).toEqual(0);
  });
});

Deno.test("SpringSequence insertAt", async () => {
  const seq = SpringSequence().insertAt(200, 100).insertAt(1000, 300)
    .insertAt(2000, 0);
  await matchCanvasImage(seq.spring, "sequence-insertAt", {
    timeAxis: [0, 4000],
    position: { min: 0, max: 350 },
    velocity: { min: -120, max: 120 },
  });
});

Deno.test("SpringSequence replaceTail", async () => {
  const seq = SpringSequence().insertAt(200, 100).insertAt(1000, 300)
    .insertAt(2000, 0).replaceTail(2300, 150);
  await matchCanvasImage(seq.spring, "sequence-replaceTail", {
    timeAxis: [0, 4000],
    position: { min: 0, max: 350 },
    velocity: { min: -120, max: 120 },
    events: [{ time: 2300 }],
  });
});
