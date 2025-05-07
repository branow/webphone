import { FC, useEffect, useContext, ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import { SipContext } from "../context/SipContext";
import { useSip } from "../hooks/useSip.ts";
import { SipAccount } from "../lib/sip.ts";
import Storage from "../lib/storage.ts";

interface Props {
  children: ReactNode;
}

const SipProvider: FC<Props> = ({ children }) => {
  const { authenticated } = useContext(AuthContext);

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

  useEffect(() => {
    if (!authenticated) return;

    if (!account) {
      const savedAccount = new Storage<SipAccount>("sip.account").get();
      if (savedAccount) {
        setAccount(savedAccount);
      }
    }
  }, [authenticated, account]);

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
