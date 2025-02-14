import { FC, useEffect, useContext } from "react";
import { BsPersonFill } from "react-icons/bs";
import { SipContext, RegistrationState } from "../account/SipProvider";
import { TabContext, Tab } from "../Phone";
import { CallContext, CallState } from "./CallProvider";
import CallWaitPane from "./CallWaitPane";
import CallActivePane from "./CallActivePane";
import CallEndPane from "./CallEndPane";
import "./CallPage.css";

const CallPage: FC = ({}) => {
  const { registrationState } = useContext(SipContext)!;
  const { switchTab } = useContext(TabContext)!;
  const { call } = useContext(CallContext)!;

  useEffect(() => {
    if (registrationState !== RegistrationState.REGISTERED) {
      switchTab(Tab.ACCOUNT);
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
      <div>
        {isWaiting() && <CallWaitPane />}
        {isActive() && <CallActivePane />}
        {isEnded() && <CallEndPane />}
      </div>
    </div>
  );
};

export default CallPage;
