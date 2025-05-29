import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styled } from "@linaria/react";
import TransparentClickableContainer from "../common/button/TransparentClickableContainer";
import AutoHeightMotion from "../common/motion/AutoHeightMotion";
import RecordRolledUp from "./RecordRolledUp";
import RecordUnrolled from "./RecordUnrolled";
import { Record } from "../../services/history";
import { useTheme } from "../../hooks/useTheme";

const Container = styled.div<{ color: string }>`
  border-left: 4px solid ${p => p.color};
  
  & > div {
    border-radius: 10px;
    width: 100%;
  }
`;

interface Props {
  record: Record;
  unrolled?: boolean;
  unroll: (id: string) => void;
  rollUp: () => void;
}

const CallRecord: FC<Props> = ({ record, unrolled, unroll, rollUp }) => {
  const th = useTheme();

  return (
    <Container color={th.colors.surface2}>
      <TransparentClickableContainer onClick={() => (unrolled ? rollUp() : unroll(record.id))}>
        <AutoHeightMotion>
         <AnimatePresence mode="wait">
            {unrolled ? (
              <motion.div
                key="unrolled"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RecordUnrolled record={record} />
              </motion.div>
            ) : (
              <motion.div
                key="rolled"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RecordRolledUp record={record} />
              </motion.div>
            )}
          </AnimatePresence>
        </AutoHeightMotion>
      </TransparentClickableContainer>
    </Container>
  );
};

export default CallRecord;
