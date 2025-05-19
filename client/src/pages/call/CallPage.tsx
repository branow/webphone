import { FC, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import PendingTab from "../../components/PendingTab";
import ErrorMessage from "../../components/ErrorMessage";
import { SipContext } from "../../context/SipContext";
import { d } from "../../lib/i18n";
import "./CallPage.css";

const CallPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { number } = useParams<{ number: string }>();
  const { calls, connection, makeCall } = useContext(SipContext);

  useEffect(() => {
    if (!connection.isConnected()) { navigate("/home"); return; }
    if (number) { makeCall( number); }
  }, [connection.isConnected(), number]);

  useEffect(() => {
    const call = calls.find(c => !c.state.isEnded() && c.number === number);
    if (call) navigate(`/call/active/${call.id}`);
  }, [calls]);

  if (!number) {
    return <ErrorMessage error={t(d.call.errors.missingNumber)} />
  }

  return <PendingTab text={t(d.ui.loading.calling)} message={t(d.ui.loading.wait)} />;
};

export default CallPage;
