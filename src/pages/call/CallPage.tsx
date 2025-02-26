import { FC, useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { SipContext, RegistrationState } from "../../providers/SipProvider";
import { CallContext } from "../../providers/CallProvider";
import PendingTab from "../../components/PendingTab";
import ErrorMessage from "../../components/ErrorMessage";
import CallActivePage from "./CallActivePage";
import "./CallPage.css";

const CallPage: FC = ({}) => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();
  
  const { registrationState } = useContext(SipContext)!;
  const { call, doCall } = useContext(CallContext)!;
  const [startedCall, setStartedCall] = useState<boolean>(false);

  useEffect(() => {
    if (number) {
      doCall(number);
      setStartedCall(true);
    }
  }, [number]);

  useEffect(() => {
    if (registrationState !== RegistrationState.REGISTERED) {
      navigate("/account");
    }
  }, [registrationState]);

  if (!number)
    return <ErrorMessage error="Invalid phone number" />

  if (!call || !startedCall) {
    return <PendingTab text="ESTABLISHING CALL" message="Please wait" />;
  }

  return (<CallActivePage />);
};

export default CallPage;
