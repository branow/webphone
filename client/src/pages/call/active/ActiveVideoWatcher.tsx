import { FC, ReactNode } from "react";
import { useIsActiveVideo } from "hooks/useIsActiveVideo";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  stream: MediaStream;
  renderWhenOn: () => ReactNode;
  renderWhenOff?: () => ReactNode;
}

const VideoTransferWatcher: FC<Props> = ({ stream, renderWhenOn, renderWhenOff }) => {
  const transferingVideo = useIsActiveVideo(stream);

  return (
    <>
      <AnimatePresence mode="wait">
        {transferingVideo && (
          <motion.span
            key="on"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderWhenOn()}
          </motion.span>
        )}
        {!transferingVideo && (
          <motion.span
            key="off"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderWhenOff ? renderWhenOff() : <></>}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}

export default VideoTransferWatcher;
