import { useEffect, RefObject } from "react";

interface Props {
  scrollRef: RefObject<HTMLDivElement>;
  move: () => Promise<any>;
  loadFactor?: number;
}

export const useInfiniteScroll = ({ scrollRef, loadFactor, move, } : Props) => {
  loadFactor = loadFactor || 0.7;
  let oftenTriggerProtection = false;

  const nextStep = async(): Promise<void> => {
    await move();
    await waitForRender();
  }

  useEffect(() => {
    const scroll = scrollRef.current!;

    // (async () => {
    //   await waitForRender();
    //   while(scroll.scrollHeight <= scroll.clientHeight) {
    //     await move();
    //     await waitForRender();
    //   }
    // }) ();
    //

    const handleScroll = () => {
      if (oftenTriggerProtection) return;
      oftenTriggerProtection = true;

      const divHeight = scroll.scrollHeight;
      const divVisibleHeight = scroll.clientHeight;
      const scrollPos = scroll.scrollTop;
      const maxScrolPos = (divHeight - divVisibleHeight) * loadFactor;
      if (scrollPos >= maxScrolPos) {
        nextStep().then(() => oftenTriggerProtection = false);
      } else {
        oftenTriggerProtection = false;
      }
    }

    scroll.addEventListener("scroll", handleScroll);

    return () => scroll.removeEventListener("scroll", handleScroll);
  }, [])

}

const waitForRender = async (): Promise<void> => {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
