import { useRef, useEffect } from "react";

export interface DelayOptions<T> {
  func: (input: T) => void;
  timeout: number;
}

export type DelayedFunc<T> = (input: T) => void;

export const useDebounce = <T>({ func, timeout }: DelayOptions<T>): DelayedFunc<T> => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }
  }, [])

  return (input: T) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      func(input);
    }, timeout);
  }
}
