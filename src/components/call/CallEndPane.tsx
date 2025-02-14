import { FC, useContext, useEffect } from "react";
import { motion as m } from "framer-motion";
import { TabContext, Tab } from "../Phone";
import { CallContext, CallState, Call, CallAgent } from "./CallProvider";
import { HistoryContext, Node, CallStatus } from "../history/HistoryProvider";
import Button from "../Button";
import DurationInMs from "../history/DurationInMs";
import DTMFAudio from "../../util/dtmf.js";
import "./CallEndPane.css";

const CallEndPane: FC = () => {
  const { switchTab } = useContext(TabContext)!;
  const { addNode } = useContext(HistoryContext)!;
  const { call } = useContext(CallContext)!;
  const status = getCallStatus(call!);
  
  useEffect(() => {
    const node: Node = {
      number: call!.number,
      status: status,
      startDate: call!.startDate,
      endDate: call!.endDate,
    }
    addNode(node);

    DTMFAudio.playCustom('howler');
    setTimeout(() => {
      DTMFAudio.stop();
    }, 1000);

    const timeout = setTimeout(() => {
      switchTab(Tab.DIALPAD);
    }, 5000);
    return () => {
      clearTimeout(timeout);
      DTMFAudio.stop();
    }
  }, [])

  const handleBack = () => switchTab(Tab.DIALPAD);

  const isEndedByLocal = () => {
    return call!.endedBy === CallAgent.LOCAL;
  }

  const isEndedByRemote = () => {
    return call!.endDate && call!.endedBy === CallAgent.REMOTE;
  }

  const localDoNotAnswer = () => {
    return status === CallStatus.MISSED;
  }

  const remoteDoNotAnswer = () => {
    return !call!.endDate && call!.endedBy === CallAgent.REMOTE;
  }

  const callFailed = () => {
    return call!.state === CallState.FAILED && status !== CallStatus.MISSED;
  }

  return (
    <m.div
      className="call-end-pane"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, easy: "easeOut" }}
    >
      <div className="call-end-pane-message">
        <div className="call-end-pane-status">
          {isEndedByLocal() && (<div>You ended the call.</div>)}
          {isEndedByRemote() && (<div>The other participant ended the call.</div>)}
          {localDoNotAnswer() && (<div>You missed the call.</div>)}
          {remoteDoNotAnswer() && (<div>The other participant did not answer.</div>)}
          {callFailed() && (<div>Call failed.</div>)}
        </div>
        {call!.endDate && 
          (<div className="call-end-pane-duration">
            <DurationInMs date1={call!.startDate} date2={call!.endDate} />
          </div>)}
      </div>
      <Button
        className="call-end-pane-back-btn"
        text="BACK"
        onClick={handleBack}
      />
    </m.div>
  );
}

function getCallStatus(call: Call): CallStatus {
  if (call.state === CallState.FAILED && 
    call.startedBy === CallAgent.REMOTE &&
    !call.endDate) {
    return CallStatus.MISSED;
  } 
  if (call.endDate) {
    if (call.startedBy === CallAgent.LOCAL) {
      return CallStatus.OUTCOMING;
    } else {
      return CallStatus.INCOMING;
    }
  }
  return CallStatus.FAILED;
}

export default CallEndPane;
