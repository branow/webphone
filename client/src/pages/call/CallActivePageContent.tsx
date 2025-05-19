import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BsPersonFill } from "react-icons/bs";
import PendingTab from "../../components/PendingTab";
import CallWaitPane from "./CallWaitPane";
import CallActivePane from "./CallActivePane";
import CallEndPane from "./CallEndPane";
import { CallContext } from "../../context/CallContext";
import { d } from "../../lib/i18n";
import "./CallPage.css";

const CallActivePageContent: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { call } = useContext(CallContext);

  useEffect(() => {
    if (!call) { navigate("/home"); }
  }, [call]);

  if (!call) {
    return <PendingTab text={t(d.ui.loading.redirecting)} />
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
