import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DurationInMs from "../../components/DurationInMs";
import { CallContext } from "../../context/CallContext";
import HistoryApi, { CallStatus } from "../../services/history";
import { CallOriginator, Call } from "../../lib/sip";
import DTMFAudio from "../../util/dtmf.js";
import "./CallEndPane.css";

const CallEndPane: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const creating = useMutation({
    mutationFn: HistoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: HistoryApi.QueryKeys.predicate });
    }
  });

  const { call } = useContext(CallContext) as { call: Call };
  const status = getCallStatus(call);

  useEffect(() => {
    if (!call) {
      navigate("/dialpad");
    }
  }, [call])
  
  useEffect(() => {
    creating.mutate({
      number: call!.number,
      status: status,
      startDate: call!.startTime,
      endDate: call!.endTime,
    });

    DTMFAudio.playCustom("howler");
    setTimeout(() => {
      DTMFAudio.stop();
    }, 1000);

    return () => {
      DTMFAudio.stop();
    }
  }, [])



  const handleBack = () => navigate("/dialpad");

  const isEndedByLocal = () => {
    return !call.error && call.endedBy === CallOriginator.LOCAL;
  }

  const isEndedByRemote = () => {
    return !call.error && call.endedBy === CallOriginator.REMOTE;
  }

  return (
    <div className="call-end-pane">
      <div className="call-end-pane-msg">
        <div className="call-end-pane-msg-stat">
          {!call.error && <div className="call-end-pane-msg-stat-ok">SUCCESSFUL CALL</div>}
          {call.error && <div className="call-end-pane-msg-stat-err">CALL FAILED</div>}
        </div>
        <div className="call-end-pane-msg-body">
          {call.error && (<div>{mapErrorMessage(call.error)}</div>)}
          {isEndedByLocal() && (<div>You ended the call.</div>)}
          {isEndedByRemote() && (<div>The other participant ended the call.</div>)}
        </div>
        {call.endTime &&
          (<div className="call-end-pane-msg-dur">
            <DurationInMs date1={call.startTime} date2={call.endTime} />
          </div>)}
      </div>
      <div className="call-end-pane-back-btn-ctn">
        <button
          className="call-end-pane-back-btn"
          onClick={handleBack}
        >
          BACK
        </button>
      </div>
    </div>
  );
}

function mapErrorMessage(error: string): string {
  if (error === "Address Incomplete") return "Address Incomplete"; // invalid number
  if (error === "Unavailable") return "Unavailable"; // you tried to call didn't get answer
  if (error === "No Answer") return "No Answer"; // you didn't answer in time (missed)
  if (error === "Rejected") return "Rejected"; // you didn't answer
  return error;
}

function getCallStatus(call: Call): CallStatus {
  if (call.error) {
    if (call.error == "No Answer") {
      return CallStatus.MISSED;
    } else {
      return CallStatus.FAILED;
    }
  } else {
    if (call.startedBy === CallOriginator.LOCAL) {
      return CallStatus.OUTCOMING;
    } else {
      return CallStatus.INCOMING;
    }
  }
}

export default CallEndPane;
