import { FC, ReactNode } from "react";
import { SipContext } from "context/SipContext";
import { useSip } from "hooks/useSip.ts";

interface Props {
  children: ReactNode;
}

const SipProvider: FC<Props> = ({ children }) => {
  const {
    account,
    setAccount,
    connection,
    connectionError,
    calls,
    makeCall,
    onIncomingCall,
    answerCall,
    hangupCall,
    sendDtmf,
    toggleHold,
    toggleMute,
  } = useSip();

  return (
    <SipContext.Provider
      value={{
        account,
        setAccount,
        connection,
        connectionError,
        calls,
        makeCall,
        onIncomingCall,
        answerCall,
        hangupCall,
        sendDtmf,
        toggleHold,
        toggleMute,
      }}
    >
      {children}
    </SipContext.Provider>
  );
};

export default SipProvider;
