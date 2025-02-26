import { FC, useContext, useEffect } from "react";
import { ImPhone, ImPhoneHangUp } from "react-icons/im";
import { CallContext, CallAgent } from "../../providers/CallProvider";
import Button from "../../components/Button";
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
    <div className="call-wait-pane">
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
    </div>
  );
};

export default CallWaitPane;
