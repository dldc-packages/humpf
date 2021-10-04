import React, { useCallback, useState, useRef, useEffect } from 'react';
import { InitCanvas, Canvas } from './Canvas';
import { getFrameData } from 'framesync';
import { PlayIcon } from './PlayIcon';
import { useElementSize } from '../hooks/useElementSize';
// import { PauseIcon } from './PauseIcon';
import { ResetIcon } from './ResetIcon';
import { PauseIcon } from './PauseIcon';
import { useLatedtRef } from '../hooks/useLatedtRef';

export type InitPlayCanvas = InitCanvas<
  { done: () => void; isDone: boolean },
  { restart?: () => void }
>;

interface Props {
  ratio?: number;
  init: InitPlayCanvas;
  loop?: boolean;
  restartOnChange?: boolean;
  restartOnChangeDebounce?: number | false;
  autoStart?: boolean;
  autoStartDelay?: number;
  previewTime?: number;
  renderWhilePaused?: boolean;
}

type PlayState =
  | { status: 'void' }
  | { status: 'playing'; startedAt: number }
  | { status: 'paused'; pausedAfter: number }
  | { status: 'done'; doneAfter: number };

export const PlayCanvas: React.FC<Props> = ({
  ratio = 16 / 9,
  init,
  loop = false,
  restartOnChange = true,
  autoStart = false,
  autoStartDelay = 500,
  previewTime = 0,
  renderWhilePaused = true,
  restartOnChangeDebounce = false as const,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const width = useElementSize(divRef).width;

  const [playState, setPlayState] = useState<PlayState>(() => {
    if (autoStart) {
      return {
        status: 'playing',
        startedAt: getFrameData().timestamp + autoStartDelay,
      };
    }
    return { status: 'void' };
  });

  const restartRef = useRef<(() => void) | undefined>(undefined);

  const renderWhilePausedRef = useLatedtRef(renderWhilePaused);

  const restartOnChangeDebounceRef = useLatedtRef(restartOnChangeDebounce);
  const restartDebounceTimer = useRef<NodeJS.Timer | null>(null);

  const playStateRef = useRef(playState);
  playStateRef.current = playState;

  const loopRef = useRef(loop);
  loopRef.current = loop;

  const reset = useCallback(() => {
    const now = getFrameData().timestamp;
    if (restartRef.current) {
      restartRef.current();
    }
    setPlayState({
      status: 'playing',
      startedAt: now,
    });
  }, []);

  const pause = useCallback(() => {
    setPlayState((prev) => {
      const now = getFrameData().timestamp;
      if (prev.status === 'playing') {
        return {
          status: 'paused',
          pausedAfter: now - prev.startedAt,
        };
      }
      return prev;
    });
  }, []);

  const play = useCallback(() => {
    setPlayState((prev) => {
      const now = getFrameData().timestamp;
      if (prev.status === 'paused') {
        return {
          status: 'playing',
          startedAt: now - prev.pausedAfter,
        };
      }
      return prev;
    });
  }, []);

  const canvasInit = useCallback<InitCanvas>(
    (ctx, data) => {
      let hasRenderOnce = false;

      const state = playStateRef.current;
      const ts =
        state.status === 'void'
          ? previewTime
          : state.status === 'done'
          ? state.doneAfter
          : state.status === 'paused'
          ? state.pausedAfter
          : data.ts - state.startedAt;

      const done = () => {
        if (playStateRef.current.status === 'playing') {
          const now = getFrameData().timestamp;
          if (loopRef.current) {
            setPlayState({
              status: 'playing',
              startedAt: now,
            });
            return;
          }
          setPlayState({
            status: 'done',
            doneAfter: now - playStateRef.current.startedAt,
          });
        }
      };

      const { draw, unmount, restart } = init(ctx, {
        ...data,
        ts,
        done,
        isDone: state.status === 'done',
      });
      restartRef.current = restart;

      return {
        draw: (data) => {
          const state = playStateRef.current;
          const ts =
            state.status === 'void'
              ? previewTime
              : state.status === 'done'
              ? state.doneAfter
              : state.status === 'paused'
              ? state.pausedAfter
              : data.ts - state.startedAt;

          if (
            hasRenderOnce === false ||
            state.status === 'playing' ||
            renderWhilePausedRef.current === true
          ) {
            hasRenderOnce = true;
            draw({ ...data, done, isDone: state.status === 'done', ts });
          }
        },
        unmount: () => {
          restartRef.current = undefined;
          if (unmount) {
            unmount();
          }
        },
      };
    },
    [init, previewTime, renderWhilePausedRef]
  );

  useEffect(() => {
    if (restartOnChange) {
      if (restartDebounceTimer.current) {
        clearTimeout(restartDebounceTimer.current);
      }
      if (restartOnChangeDebounceRef.current === false) {
        reset();
      } else {
        restartDebounceTimer.current = setTimeout(() => {
          reset();
        }, restartOnChangeDebounceRef.current);
      }
    }
  }, [canvasInit, reset, restartOnChange, restartOnChangeDebounceRef]);

  const bigButtonSize = width * 0.08;
  const smallButtonSize = width * 0.05;
  const showStart = playState.status === 'void';
  const showRestart = playState.status === 'done';
  const showControls = showStart === false && showRestart === false;

  return (
    <div className="PlayCanvas">
      <Canvas ratio={ratio} init={canvasInit} containerRef={divRef} />
      <div
        className="PlayCanvas--overlay"
        style={{
          opacity: showStart ? 1 : 0,
          pointerEvents: showStart ? 'all' : 'none',
        }}
      >
        <button onClick={reset} className="PlayCanvas--big-button">
          <PlayIcon size={bigButtonSize} />
        </button>
      </div>
      <div
        className="PlayCanvas--overlay"
        style={{
          opacity: showRestart ? 1 : 0,
          pointerEvents: showRestart ? 'all' : 'none',
        }}
      >
        <button onClick={reset} className="PlayCanvas--big-button">
          <ResetIcon size={bigButtonSize} />
        </button>
      </div>
      <div
        className="PlayCanvas--controls"
        style={{
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'all' : 'none',
        }}
      >
        <button
          onClick={reset}
          className="PlayCanvas--button"
          style={{ marginLeft: smallButtonSize / 2 }}
        >
          <ResetIcon size={smallButtonSize} />
        </button>
        {playState.status === 'paused' ? (
          <button onClick={play} className="PlayCanvas--button">
            <PlayIcon size={smallButtonSize} />
          </button>
        ) : (
          <button onClick={pause} className="PlayCanvas--button">
            <PauseIcon size={smallButtonSize} />
          </button>
        )}
      </div>
    </div>
  );
};
