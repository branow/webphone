import { FC, useContext } from "react";
import SipAccountForm from "./SipAccountForm"
import { SipContext, RegistrationState, ConnectionState } from "./SipProvider";
import "./SipAccountPage.css";

const SipAccountPage: FC = () => {
  const {registrationState, connectionState} = useContext(SipContext)!;

  const isRegistered = (): boolean => {
    return registrationState === RegistrationState.REGISTERED;
  }

  const isConnecting = (): boolean => {
    return connectionState === ConnectionState.CONNECTING;
  }

  return (
    <div className="sip-account-page">
      {isConnecting() && 
        (<div className="sip-account-page-connecting">
          <div className="sip-account-page-connecting-animation pending">
            CONECTING
          </div>
          <div className="sip-account-page-connecting-message">
            Please wait...
          </div>
        </div>)}
      {!isConnecting() && !isRegistered() && (<SipAccountForm />)}
    </div>
  );
};

export default SipAccountPage;
