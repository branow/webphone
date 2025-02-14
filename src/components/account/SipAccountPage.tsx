import { FC, useEffect, useContext } from "react";
import { motion as m } from "framer-motion";
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
    <m.div
      className="sip-account-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, easy: "easeOut" }}
    >
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
    </m.div>
  );
};

export default SipAccountPage;
