import { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ImPhone, ImPhoneHangUp } from "react-icons/im";
import PendingTab from "../../components/PendingTab.js";
import { CallContext } from "../../context/CallContext";
import { CallOriginator } from "../../lib/sip";
import { d } from "../../lib/i18n";
import DTMFAudio from "../../util/dtmf.js";
import "./CallWaitPane.css";

const CallWaitPane: FC = () => {
  const { t } = useTranslation();
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
        <PendingTab text={t(d.ui.loading.calling)} size={36} />
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
