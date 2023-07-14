import type { CanvasRenderingContext2D } from 'canvas';
import { createCanvas } from 'canvas';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import type { ISpringFn } from '../src/mod';

export function map(inMin: number, inMax: number, outMin: number, outMax: number, num: number): number {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export type CanvasImageConfig = {
  width?: number;
  timeAxis: [min: number, max: number];
  position?: { height?: number; min: number; max: number };
  velocity?: { height?: number; min: number; max: number };
  events?: Array<{ time: number; label?: string }>;
};

export type SpringExport = Array<[time: number, pos: number, vel: number]>;

/**
 * Generate an image that show the spring
 * and returns data
 */
export async function canvasImage(
  spring: ISpringFn,
  fileName: string,
  { width = 600, timeAxis, position, velocity, events }: CanvasImageConfig,
): Promise<SpringExport> {
  // create value for each width pixel
  const values: SpringExport = [];
  for (let x = 0; x <= width; x++) {
    const time = map(0, width, timeAxis[0], timeAxis[1], x);
    const res = spring(time);
    values.push([time, res.position, res.velocity]);
  }

  if (!position && !velocity) {
    return values;
  }

  const pos = position ? { height: 300, ...position } : null;
  const vel = velocity ? { height: 150, ...velocity } : null;

  const padding = 10;
  const height = padding + (pos?.height ?? 0) + (pos && vel ? padding : 0) + (vel?.height ?? 0) + padding;

  // Create image
  const canvas = createCanvas(200, 200);
  canvas.width = padding + width + padding;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  // white bg
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // set origin to chart origin
  ctx.translate(padding, padding);

  ctx.save();

  // position
  if (pos) {
    const { min, max, height } = pos;

    // chart bg
    ctx.fillStyle = '#ECEFF1';
    ctx.fillRect(0, 0, width, height);

    if (events) {
      events.forEach(({ time }) => {
        const x = map(timeAxis[0], timeAxis[1], 0, width, time);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = '#607D8B';
        ctx.stroke();
      });
    }

    drawCurve(
      ctx,
      values.map((vals) => vals[1]),
      min,
      max,
      height,
      '#42A5F5',
    );

    ctx.translate(0, height + padding);
  }

  // velocity
  if (vel) {
    const { min, max, height } = vel;

    // chart bg
    ctx.fillStyle = '#ECEFF1';
    ctx.fillRect(0, 0, width, height);

    if (events) {
      events.forEach(({ time }) => {
        const x = map(timeAxis[0], timeAxis[1], 0, width, time);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = '#607D8B';
        ctx.stroke();
      });
    }

    drawCurve(
      ctx,
      values.map((vals) => vals[2]),
      min,
      max,
      height,
      '#EF5350',
    );
  }

  ctx.restore();

  const targetFile = resolve('tests', 'images', fileName + '.png');
  const out = createWriteStream(targetFile);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  await new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  return values;
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  values: Array<number>,
  min: number,
  max: number,
  height: number,
  color: string,
): void {
  ctx.strokeStyle = color;
  ctx.beginPath();
  values.forEach((val, x) => {
    const ry = map(max, min, 0, height, val);
    if (x === 0) {
      ctx.moveTo(x, ry);
    } else {
      ctx.lineTo(x, ry);
    }
  });
  ctx.stroke();
}
