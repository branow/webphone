import { FC, ReactNode, useContext } from "react";
import { SipContext } from "context/SipContext";
import { CallContext } from "context/CallContext";

interface Props {
  callId: string;
  children: ReactNode;
}

const CallProvider: FC<Props> = ({ callId, children }) => {
  const {
    calls,
    answerCall,
    hangupCall,
    sendDtmf,
    toggleHold,
    toggleMicro,
    toggleAudio,
    toggleCamera,
  } = useContext(SipContext);

  return (
    <CallContext.Provider value={{
      call: calls.find(c => c.id === callId) || null,
      answerCall: () => answerCall(callId),
      hangupCall: () => hangupCall(callId),
      sendDtmf: (tone: string | number) => sendDtmf(callId, tone),
      toggleHold: () => toggleHold(callId),
      toggleMicro: () => toggleMicro(callId),
      toggleAudio: () => toggleAudio(callId),
      toggleCamera: () => toggleCamera(callId),
    }}>
      {children}
    </CallContext.Provider>
  );
};

export default CallProvider;
