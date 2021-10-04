import { useState, useCallback } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function getSize(el: HTMLElement | null | undefined): Size {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

interface Size {
  width: number;
  height: number;
}

export function useElementSize(ref: React.MutableRefObject<HTMLElement | undefined | null>): Size {
  const [ComponentSize, setComponentSize] = useState(getSize(ref.current));

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }, [ref]);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, ref]);

  return ComponentSize;
}
