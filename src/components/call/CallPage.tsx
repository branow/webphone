import { FC, useEffect, useContext } from "react";
import { BsPersonFill } from "react-icons/bs";
import { AnimatePresence, motion as m } from "framer-motion";
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
    <m.div
      className="call-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, easy: "easeOut" }}
    >
      <div className="call-page-top">
        <div className="call-page-person">
          <BsPersonFill />
        </div>
        <div className="call-page-number">{call!.number}</div>
      </div>
      <AnimatePresence initial={false} mode={'wait'}>
        <div key={call!.state}>
          {isWaiting() && <CallWaitPane />}
          {isActive() && <CallActivePane />}
          {isEnded() && <CallEndPane />}
        </div>
      </AnimatePresence>
    </m.div>
  );
};

export default CallPage;
