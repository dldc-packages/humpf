import { MutableRefObject, useRef } from 'react';

export function useOrCreateRef<T>(
  ref: MutableRefObject<T> | undefined | null,
  value: T
): MutableRefObject<T> {
  const created: MutableRefObject<T> = useRef<T>(value);
  if (ref) {
    return ref;
  }
  return created;
}
