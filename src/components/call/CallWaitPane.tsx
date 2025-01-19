import { FC, useContext, useEffect } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { FiPhone } from "react-icons/fi";
import { CallContext, CallAgent } from "./CallProvider";
import Button from "../Button";
import DTMFAudio from "../../util/dtmf.js";

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
    <div>
      <div>Calling...</div>
      <div>
        <Button Icon={ImPhoneHangUp} onClick={handleTerminate} />
        {isIncoming() && (<Button Icon={FiPhone} onClick={handleAnswer} />)}
      </div>
    </div>
  );
};

export default CallWaitPane;
