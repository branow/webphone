import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { SipContext, RegistrationState, ConnectionState } from "../../providers/SipProvider";
import PendingTab from "../../components/PendingTab";
import SipAccountForm from "./SipAccountForm"
import "./SipAccountPage.css";

const SipAccountPage: FC = () => {
  const {registrationState, connectionState} = useContext(SipContext)!;
  const navigate = useNavigate();

  useEffect(() => { 
    if (registrationState === RegistrationState.REGISTERED) {
      navigate("/dialpad");
    }
  }, [registrationState])

  const isConnecting = (): boolean => {
    return connectionState === ConnectionState.CONNECTING;
  }

  return (
    <div className="sip-account-page">
      {isConnecting() && (
        <PendingTab text="CONNECTING" message="Please wait" />
      )}
      {!isConnecting() && (<SipAccountForm />)}
    </div>
  );
};

export default SipAccountPage;
