import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  duration?: number;
}

const AutoHeightMotion: FC<Props> = ({  children, duration }) => {
  duration = duration || 0.3;
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>("auto");

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(entry => setHeight(entry.contentRect.height));
    });
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height }}
      transition={{ duration: duration }}
      style={{ overflow: "hidden" }}
    >
      <div ref={ref}>
        <div></div>
        {children}
      </div>
    </motion.div>
  );
};

export default AutoHeightMotion;
