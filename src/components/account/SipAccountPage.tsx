import { FC, useEffect, useContext } from "react";
import SipAccountForm from "./SipAccountForm"
import { SipContext, RegistrationState, ConnectionState } from "./SipProvider";
import { TabContext, Tab } from "../Phone";
import "./SipAccountPage.css";

const SipAccountPage: FC = () => {
  const {registrationState, connectionState} = useContext(SipContext)!;
  const { switchTab } = useContext(TabContext)!;

  useEffect(() => { 
    if (registrationState === RegistrationState.REGISTERED) {
      switchTab(Tab.DIALPAD);
    }
  }, [registrationState])

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
      {!isConnecting() && (<SipAccountForm />)}
    </div>
  );
};

export default SipAccountPage;
