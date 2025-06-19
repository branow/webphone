import { FC, ReactNode, RefObject, useRef } from "react";
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
    toggleAudio,
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
        toggleMute,
        toggleAudio,
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
