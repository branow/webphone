import { FC, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import PendingTab from "../../components/PendingTab";
import ErrorMessage from "../../components/ErrorMessage";
import { SipContext } from "../../context/SipContext";
import "./CallPage.css";

const CallPage: FC = () => {
  const navigate = useNavigate();
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
    return <ErrorMessage error="Invalid phone number" />
  }

  return <PendingTab text="CALLING" message="Please wait" />;
};

export default CallPage;
