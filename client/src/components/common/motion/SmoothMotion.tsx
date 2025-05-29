import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { size } from "../../../styles";

export enum Side {
  Right = "right",
  Left = "left",
  Top = "top",
  Bottom = "bottom",
  None = "none",
}

const offsetMap = {
  [Side.Left]: { x: -size.phone.w, y: 0 },
  [Side.Right]: { x: size.phone.w, y: 0 },
  [Side.Top]: { x: 0, y: -size.phone.h },
  [Side.Bottom]: { x: 0, y: size.phone.h },
  [Side.None]: { x: 0, y: 0 },
};

interface Props {
  children: ReactNode;
  enter: boolean;
  side: Side;
}

const SmoothMotion: FC<Props> = ({ children, enter, side }) => {
  let displayHidden = side !== Side.None ? "block" : "none";

  const hiddenOffset = offsetMap[side];

  const hidden = {
    opacity: 0,
    ...hiddenOffset,
    display: displayHidden,
  };

  const shown = {
    opacity: 1,
    x: 0,
    y: 0,
    display: "block",
  };

  return (
    <motion.div
      initial={enter ? hidden : shown}
      animate={enter ? shown : hidden}
      transition={{ duration: 0.5 }}
      style={{ width: "100%", height: "100%", position: "absolute" }}
    >
      {children}
    </motion.div>
  );
};

export default SmoothMotion;
