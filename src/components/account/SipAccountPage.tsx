import { FC, useContext } from "react";
import SipAccountForm from "./SipAccountForm"
import { SipContext, RegistrationState, ConnectionState } from "./SipProvider";

const SipAccountPage: FC = () => {
  const {registrationState, connectionState} = useContext(SipContext)!;

  const isRegistered = (): boolean => {
    return registrationState === RegistrationState.REGISTERED;
  }

  const isConnecting = (): boolean => {
    return connectionState === ConnectionState.CONNECTING;
  }

  return (
    <>
      {isConnecting() && (<div>Loading...</div>)}
      {!isConnecting() && !isRegistered() && (<SipAccountForm />)}
    </>
  );
};

export default SipAccountPage;
