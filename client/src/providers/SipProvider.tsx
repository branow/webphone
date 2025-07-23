import { FC, ReactNode } from "react";
import { SipContext } from "context/SipContext";
import { useSip } from "hooks/useSip";

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
    toggleMicro,
    toggleAudio,
    toggleCamera,
    audioRefs,
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
        toggleMicro,
        toggleAudio,
        toggleCamera,
      }}
    >
      {children}
      {Array.from(audioRefs).map(audioRef => (
        <audio key={audioRef[0]} ref={audioRef[1]} autoPlay={true} />
      ))}
    </SipContext.Provider>
  );
};

export default SipProvider;
