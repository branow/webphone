import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { BsPersonFill } from "react-icons/bs";
import { SipContext, RegistrationState } from "../../providers/SipProvider";
import { CallContext, CallState } from "../../providers/CallProvider";
import CallWaitPane from "./CallWaitPane";
import CallActivePane from "./CallActivePane";
import CallEndPane from "./CallEndPane";
import "./CallPage.css";

const CallActivePage: FC = ({}) => {
  const navigate = useNavigate();
  const { registrationState } = useContext(SipContext)!;
  const { call } = useContext(CallContext)!;

  useEffect(() => {
    if (registrationState !== RegistrationState.REGISTERED) {
      navigate("/account");
    }
  }, [registrationState]);

  const isWaiting = () => {
    return call!.state  === CallState.PROGRESS;
  }

  const isActive = () => {
    return call!.state  === CallState.CONFIRMED ||
      call!.state === CallState.HOLD;
  }

  const isEnded = () => {
    return call!.state === CallState.ENDED ||
      call!.state === CallState.FAILED;
  }

  return (
    <div className="call-page">
      <div className="call-page-top">
        <div className="call-page-person">
          <BsPersonFill />
        </div>
        <div className="call-page-number">{call!.number}</div>
      </div>
      <div key={call!.state}>
        {isWaiting() && <CallWaitPane />}
        {isActive() && <CallActivePane />}
        {isEnded() && <CallEndPane />}
      </div>
    </div>
  );
};

export default CallActivePage;
