import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DurationInMs from "../../components/DurationInMs";
import { CallContext } from "../../context/CallContext";
import HistoryApi, { CallStatus } from "../../services/history";
import { CallOriginator, Call } from "../../lib/sip";
import { d } from "../../lib/i18n";
import DTMFAudio from "../../util/dtmf.js";
import "./CallEndPane.css";

const CallEndPane: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          {!call.error && <div className="call-end-pane-msg-stat-ok">{t(d.call.messages.success)}</div>}
          {call.error && <div className="call-end-pane-msg-stat-err">{t(d.call.messages.failed)}</div>}
        </div>
        <div className="call-end-pane-msg-body">
          {call.error && (<div>{t(mapErrorMessage(call.error))}</div>)}
          {isEndedByLocal() && (<div>{t(d.call.messages.endedByYou)}</div>)}
          {isEndedByRemote() && (<div>{t(d.call.messages.endedByOther)}</div>)}
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
          {t(d.ui.buttons.back)}
        </button>
      </div>
    </div>
  );
}

function mapErrorMessage(error: string): string {
  if (error === "Address Incomplete") return d.call.errors.invalidNumber; // invalid number
  if (error === "Unavailable") return d.call.errors.unavailable; // you tried to call didn't get answer
  if (error === "No Answer") return d.call.errors.noAnswer; // you didn't answer in time (missed)
  if (error === "Rejected") return d.call.errors.rejected; // you didn't answer
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
      return CallStatus.OUTGOING;
    } else {
      return CallStatus.INCOMING;
    }
  }
}

export default CallEndPane;
