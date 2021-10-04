import React, { useCallback } from 'react';
import { CurveCanvas } from './CurveCanvas';
import { SpringSequenceFn } from '@humpf';

interface Props {
  spring: SpringSequenceFn;
  //
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

export const SpringCanvas: React.FC<Props> = ({ spring, ...other }) => {
  const position = useCallback((x) => spring.position(x), [spring]);

  return <CurveCanvas position={position} restartOnChange={false} {...other} />;
};
