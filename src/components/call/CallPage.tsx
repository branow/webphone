import { FC, useContext } from "react";
import { BsPersonFill } from "react-icons/bs";
import { TabContext, Tab } from "../Phone";
import { CallContext, CallState } from "./CallProvider";
import CallWaitPane from "./CallWaitPane";
import CallActivePane from "./CallActivePane";
import CallEndPane from "./CallEndPane";

const CallPage: FC = ({}) => {
  const { call } = useContext(CallContext)!;

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
    <div>
      <div>
        <BsPersonFill />
        <div>{call!.number}</div>
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
