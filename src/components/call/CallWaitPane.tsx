import { FC, useContext, useEffect } from "react";
import { ImPhone, ImPhoneHangUp } from "react-icons/im";
import { motion as m } from "framer-motion";
import { CallContext, CallAgent } from "./CallProvider";
import Button from "../Button";
import DTMFAudio from "../../util/dtmf.js";
import "./CallWaitPane.css";

const CallWaitPane: FC = () => {
  const { call } = useContext(CallContext)!;

  useEffect(() => {
    const track = isIncoming() ? "ringback" : "dial";
    DTMFAudio.playCustom(track);
    return () => DTMFAudio.stop();
  }, [])

  const isIncoming = (): boolean => {
    return call!.startedBy === CallAgent.REMOTE;
  }

  const handleTerminate = () => call!.terminate();

  const handleAnswer = () => call!.answer();

  return (
    <m.div
      className="call-wait-pane"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, easy: "easeOut" }}
    >
      <div className="calling"></div>
      <div className="call-wait-pane-control">
        <Button
          className="hang-up-btn control-btn"
          Icon={ImPhoneHangUp}
          onClick={handleTerminate}
        />
        {isIncoming() &&
          (<Button
            className="call-btn control-btn"
            Icon={ImPhone}
            onClick={handleAnswer}
          />)
        }
      </div>
    </m.div>
  );
};

export default CallWaitPane;
