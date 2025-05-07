import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { BsPersonFill } from "react-icons/bs";
import PendingTab from "../../components/PendingTab";
import CallWaitPane from "./CallWaitPane";
import CallActivePane from "./CallActivePane";
import CallEndPane from "./CallEndPane";
import { CallContext } from "../../context/CallContext";
import "./CallPage.css";

const CallActivePageContent: FC = () => {
  const navigate = useNavigate();
  const { call } = useContext(CallContext);

  useEffect(() => {
    if (!call) { navigate("/home"); }
  }, [call]);

  if (!call) {
    return <PendingTab text="MOVING HOME" />
  }

  return (
    <div className="call-page">
      <div className="call-page-top">
        <div className="call-page-person">
          <BsPersonFill />
        </div>
        <div className="call-page-number">{call.number}</div>
      </div>
      {call.state.isOnProgress() && <CallWaitPane />}
      {call.state.isEstablished() && <CallActivePane />}
      {call.state.isEnded() && <CallEndPane />}
    </div>
  );
};

export default CallActivePageContent;
