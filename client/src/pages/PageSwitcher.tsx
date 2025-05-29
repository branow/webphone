import { FC } from "react";
import SmoothMotion from "../components/common/motion/SmoothMotion";
import { usePageTransition } from "../hooks/usePageTransition";
import { PageSwitcherContext } from "../context/PageSwitcherContext";

const PageSwitcher: FC = () => {
  const { cur, prev } = usePageTransition();

  return (
    <PageSwitcherContext.Provider
      value={{
        current: {
          location: cur.location,
          path: cur.path,
        },
        previous: prev ? {
          location: prev.location,
          path: prev.path
        } : undefined
      }}
    >
      {cur && (
        <SmoothMotion key={cur.key} side={cur.side} enter={true}>
          {cur.page}
        </SmoothMotion>
      )}
      {prev && (
        <SmoothMotion key={prev.key} side={prev.side} enter={false}>
          {prev.page}
        </SmoothMotion>
      )}
    </PageSwitcherContext.Provider>
  );
}

export default PageSwitcher;
