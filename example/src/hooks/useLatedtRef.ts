import { MutableRefObject, useRef } from 'react';

export function useLatedtRef<T>(value: T): MutableRefObject<T> {
  const ref: MutableRefObject<T> = useRef<T>(value);
  ref.current = value;
  return ref;
}
