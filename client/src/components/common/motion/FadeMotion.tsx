import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { cx, css } from "@linaria/core";

const cssContainer = css`
  width: 100%;
  height: 100%;
`;

const cssCenter = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface Props {
  children: ReactNode;
  center?: boolean;
}

const FadeMotion: FC<Props> = ({ children, center }) => {
  return (
    <motion.div
      className={cx(cssContainer, center && cssCenter)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeMotion;
