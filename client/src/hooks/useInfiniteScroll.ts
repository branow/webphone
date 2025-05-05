import { useEffect, RefObject, useRef } from "react";

interface Props {
  scrollRef: RefObject<HTMLDivElement>;
  move: () => Promise<void>;
  loadFactor?: number;
}

export const useInfiniteScroll = ({ scrollRef, loadFactor, move, } : Props) => {
  loadFactor = loadFactor || 0.7;

  const oftenTriggerProtectionRef = useRef<boolean>(false);


  useEffect(() => {
    const scroll = scrollRef.current!;

    (async () => {
      await waitForRender();
      while(scroll.scrollHeight <= scroll.clientHeight) {
        await move();
        await waitForRender();
      }
    }) ();

    const nextStep = async(): Promise<void> => {
      await move();
      await waitForRender();
    }

    const handleScroll = () => {
      if (oftenTriggerProtectionRef.current) return;
      oftenTriggerProtectionRef.current = true;

      const divHeight = scroll.scrollHeight;
      const divVisibleHeight = scroll.clientHeight;
      const scrollPos = scroll.scrollTop;
      const maxScrolPos = (divHeight - divVisibleHeight) * loadFactor;
      if (scrollPos >= maxScrolPos) {
        nextStep().then(() => oftenTriggerProtectionRef.current = false);
      } else {
        oftenTriggerProtectionRef.current = false;
      }
    }

    scroll.addEventListener("scroll", handleScroll);

    return () => scroll.removeEventListener("scroll", handleScroll);
  }, [ loadFactor, move, scrollRef ])

}

const waitForRender = async (): Promise<void> => {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
