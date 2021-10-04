import React, { useCallback } from 'react';
import { PlayCanvas, InitPlayCanvas } from './PlayCanvas';
import { Curve, CurvePoint, map, horizontalLine, withContext, verticalLine } from '../Utils';

interface Props {
  position: (x: number) => number;
  loop?: boolean;
  ratio?: number;
  yMin?: number;
  yMax?: number;
  xMin?: number;
  xMax?: number;
  restartOnChange?: boolean;
  restartOnChangeDebounce?: number | false;
  autoStart?: boolean;
  autoStartDelay?: number;
  horizontalLines?: Array<number>;
  verticalLines?: Array<number>;
}

export const CurveCanvas: React.FC<Props> = ({
  position,
  loop,
  yMin = 0,
  yMax = 100,
  xMin = 0,
  xMax = 1000,
  restartOnChange,
  restartOnChangeDebounce,
  autoStart,
  autoStartDelay,
  ratio = 2 / 1,
  horizontalLines,
  verticalLines,
}) => {
  const duration = xMax - xMin;

  const init = useCallback<InitPlayCanvas>(
    (ctx) => {
      const hLines = horizontalLines ?? [];
      const vLines = verticalLines ?? [];

      const curve = Curve(position, { xMin, xMax, yMax, yMin });
      const point = CurvePoint(position, { xMin, xMax, yMax, yMin });

      return {
        draw: ({ width, height, ts, done, isDone }) => {
          if (!isDone && ts > duration) {
            done();
          }

          const x = map(0, duration, xMin, xMax, ts);

          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = '#352730';
          ctx.fillRect(0, 0, width, height);

          const padding = height * 0.1;

          const ballRadius = width * 0.03;
          const ballOffset = ballRadius * 2;
          const smallBallRadius = ballRadius / 5;

          const graphWidth = width - padding * 2 - ballOffset;
          const graphHeight = height - padding * 2;

          const lineThickness = Math.max(1, width * 0.001);

          const hLinesY = hLines.map((pos) => map(yMin, yMax, 0, graphHeight, pos));
          const vLinesY = vLines.map((pos) => map(xMin, xMax, 0, graphWidth, pos));

          withContext(ctx, () => {
            ctx.translate(padding + ballOffset, padding);
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(0, 0, graphWidth, graphHeight);
            const ballPos = point(-ballOffset, graphHeight, x);
            const pointPos = point(graphWidth, graphHeight, x);

            // Lines
            withContext(ctx, () => {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.lineWidth = lineThickness;
              ctx.setLineDash([5, 10]);
              hLinesY.forEach((v) => {
                const currentYDiff = Math.abs(v - ballPos.y);
                const opacity = currentYDiff < 10 ? currentYDiff / 10 : 1;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                horizontalLine(ctx, 0, graphWidth, v);
              });
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
              vLinesY.forEach((v) => {
                verticalLine(ctx, 0, graphHeight, v);
              });
            });

            // y line
            withContext(ctx, () => {
              ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
              ctx.lineWidth = lineThickness;
              horizontalLine(ctx, -ballRadius, pointPos.x, ballPos.y);
            });

            // graph
            withContext(ctx, () => {
              ctx.strokeStyle = '#1a7098';
              ctx.lineWidth = lineThickness * 2;
              curve(ctx, graphWidth, graphHeight, x);

              ctx.beginPath();
              ctx.arc(pointPos.x, pointPos.y, smallBallRadius, 0, 2 * Math.PI);
              ctx.fillStyle = '#E53935';
              ctx.fill();
            });

            withContext(ctx, () => {
              ctx.beginPath();
              ctx.arc(-ballRadius, ballPos.y, ballRadius, 0, 2 * Math.PI);
              ctx.fillStyle = '#E53935';
              ctx.fill();
            });
          });
        },
      };
    },
    [horizontalLines, verticalLines, position, xMin, xMax, yMax, yMin, duration]
  );

  return (
    <PlayCanvas
      init={init}
      loop={loop}
      {...{
        restartOnChange,
        autoStart,
        autoStartDelay,
        previewTime: duration,
        ratio,
        restartOnChangeDebounce,
      }}
    />
  );
};
