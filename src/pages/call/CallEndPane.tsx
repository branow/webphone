import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { CallContext, CallState, Call, CallAgent } from "../../providers/CallProvider";
import { HistoryContext, Node, CallStatus } from "../../providers/HistoryProvider";
import Button from "../../components/Button";
import DurationInMs from "../../components/DurationInMs";
import DTMFAudio from "../../util/dtmf.js";
import "./CallEndPane.css";

const CallEndPane: FC = () => {
  const navigate = useNavigate();
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

    DTMFAudio.playCustom("howler");
    setTimeout(() => {
      DTMFAudio.stop();
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/dialpad");
    }, 5000);
    return () => {
      clearTimeout(timeout);
      DTMFAudio.stop();
    }
  }, [])

  const handleBack = () => navigate("/dialpad");

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
    <div className="call-end-pane">
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
    </div>
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
