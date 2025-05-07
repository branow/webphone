import { FC, useContext, useEffect } from "react";
import { ImPhone, ImPhoneHangUp } from "react-icons/im";
import { CallContext } from "../../context/CallContext";
import { CallOriginator } from "../../lib/sip";
import DTMFAudio from "../../util/dtmf.js";
import "./CallWaitPane.css";
import PendingTab from "../../components/PendingTab.js";

const CallWaitPane: FC = () => {
  const { call, hangupCall, answerCall } = useContext(CallContext);

  useEffect(() => {
    const track = isIncoming() ? "ringback" : "dial";
    DTMFAudio.playCustom(track);
    return () => DTMFAudio.stop();
  }, [])

  const isIncoming = (): boolean => {
    return call!.startedBy === CallOriginator.REMOTE;
  }

  return (
    <div className="call-wait-pane">
      <div className="call-wait-pane-load-ctn">
        <PendingTab text="CALLING" size={36} />
      </div>
      <div className="call-wait-pane-ctrl-ctn">
        <div className="call-wait-pane-ctrl-btn">
          <button
            className="hang-up-btn control-btn"
            onClick={() => hangupCall()}
          ><ImPhoneHangUp /></button>
        </div>
        {isIncoming() &&
          (
            <div className="call-wait-pane-ctrl-btn">
              <button
                className="call-btn control-btn"
                onClick={() => answerCall()}
              >
                <ImPhone />
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CallWaitPane;
