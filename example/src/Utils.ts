interface CurveOptions {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  xStep?: number;
}

type DrawCurve = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  xProgress: number
) => void;

export function Curve(fn: (x: number) => number, options: CurveOptions = {}): DrawCurve {
  const { xMin = 0, xMax = 100, yMin = 0, yMax = 100, xStep = 5 } = options;

  return (ctx: CanvasRenderingContext2D, width: number, height: number, rawTs: number): void => {
    const ts = clamp(xMin, xMax, rawTs);

    ctx.beginPath();
    for (let x = xMin; x < ts; x += xStep) {
      const py = fn(x);
      const rx = map(xMin, xMax, 0, width, x);
      const ry = map(yMin, yMax, 0, height, py);
      if (x === 0) {
        ctx.moveTo(rx, ry);
      } else {
        ctx.lineTo(rx, ry);
      }
    }
    ctx.stroke();
  };
}

export function map(
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  num: number
): number {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

interface CurvePointOptions {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
}

interface Position {
  x: number;
  y: number;
}

export type GetCurvePoint = (width: number, height: number, x: number) => Position;

export function CurvePoint(
  fn: (x: number) => number,
  options: CurvePointOptions = {}
): GetCurvePoint {
  const { xMin = 0, xMax = 100, yMin = 0, yMax = 100 } = options;

  return (width: number, height: number, rawTs: number): Position => {
    const px = clamp(xMin, xMax, rawTs);
    const py = fn(px);
    const rx = map(xMin, xMax, 0, width, px);
    const ry = map(yMin, yMax, 0, height, py);
    return {
      x: rx,
      y: ry,
    };
  };
}

export function clamp(min: number, max: number, num: number): number {
  return Math.max(min, Math.min(max, num));
}

export function horizontalLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

export function verticalLine(
  ctx: CanvasRenderingContext2D,
  y1: number,
  y2: number,
  x: number
): void {
  ctx.beginPath();
  ctx.moveTo(x, y1);
  ctx.lineTo(x, y2);
  ctx.stroke();
}

export function withContext<T>(ctx: CanvasRenderingContext2D, exec: () => T): T {
  ctx.save();
  const res = exec();
  ctx.restore();
  return res;
}
