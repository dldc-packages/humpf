import React, { useMemo } from 'react';
import { useElementSize } from '../hooks/useElementSize';
import { useRef, useEffect } from 'react';
import sync, { cancelSync, getFrameData } from 'framesync';
import { useLatedtRef } from '../hooks/useLatedtRef';
import { useOrCreateRef } from '../hooks/useOrCreateRef';

interface DrawData {
  ts: number;
  width: number;
  height: number;
}

export type DrawUpdate<CustomData> = (data: DrawData & CustomData) => void;

interface InitResult<CustomData> {
  draw: DrawUpdate<CustomData>;
  unmount?: () => void;
}

export type InitCanvas<CustomData = {}, CustomResult = {}> = (
  ctx: CanvasRenderingContext2D,
  data: DrawData & CustomData
) => InitResult<CustomData> & CustomResult;

export interface Size {
  width: number;
  height: number;
}

interface Props {
  ratio?: number;
  init: InitCanvas;
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export const Canvas: React.FC<Props> = ({ ratio = 16 / 9, init, containerRef }) => {
  const divRef = useOrCreateRef<HTMLDivElement | null>(containerRef, null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = useElementSize(divRef).width;
  const height = Math.floor(width / ratio);

  const size = useMemo(() => ({ width, height }), [width, height]);

  const sizeRef = useLatedtRef(size);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      return;
    }
    const ctx = canvasEl.getContext('2d');
    if (!ctx) {
      return;
    }
    const data: DrawData = {
      ts: getFrameData().timestamp,
      width: sizeRef.current.width,
      height: sizeRef.current.height,
    };
    const { draw, unmount } = init(ctx, data);
    const process = sync.render((frame) => {
      draw({
        ts: frame.timestamp,
        width: sizeRef.current.width,
        height: sizeRef.current.height,
      });
    }, true);
    return () => {
      cancelSync.render(process);
      if (unmount) {
        unmount();
      }
    };
  }, [init, sizeRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = size.width;
      canvas.height = size.height;
    }
  }, [size]);

  return (
    <div ref={divRef} style={{ height }} className="Canvas">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
