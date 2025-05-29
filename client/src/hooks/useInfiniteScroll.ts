import { useEffect, RefObject, useRef } from "react";

interface Options {
  scrollRef: RefObject<HTMLDivElement>;
  next: () => Promise<void>;
  hasNext: boolean;
  loadFactor?: number;
}

export function useInfiniteScroll({ scrollRef, next, hasNext, loadFactor } : Options) {
  loadFactor = loadFactor || 0.7;

  const isLoadingRef = useRef(false);

  const protectedNext = async(): Promise<void> => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    await next();
    await waitForRender();
    isLoadingRef.current = false;
  }

  useEffect(() => {
    if (!hasNext) return;
    const scroll = scrollRef.current!;
    if (!scroll) return;

    const handleScroll = () => {
      const { scrollHeight, clientHeight, scrollTop } = scroll;
      const triggerPoint = (scrollHeight - clientHeight) * loadFactor;

      if (scrollTop >= triggerPoint) {
        protectedNext();
      }
    }

    scroll.addEventListener("scroll", handleScroll);

    return () => scroll.removeEventListener("scroll", handleScroll);
  }, [ next, hasNext, loadFactor ]);

  useEffect(() => {
    if (!hasNext) return;
    const scroll = scrollRef.current!;
    if (!scroll) return;

    const vf = new ViewportFiller(scroll, protectedNext, hasNext);
    vf.start();

    return () => { vf.stop(); };
  }, [hasNext, next]);

}

class ViewportFiller {
  constructor(
    private scroll: HTMLDivElement,
    private next: () => Promise<void>,
    private hasNext: boolean,
  ) {}

  async start() {
    waitForRender();
    while (this.hasNext && this.scroll.scrollHeight < this.scroll.clientHeight) {
      await this.next();
    }
  }

  stop() {
    this.hasNext = false;
  }
}

const waitForRender = async (): Promise<void> => {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
