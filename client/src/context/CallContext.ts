import { createContext } from "react";
import { Call } from "lib/sip";

export type CallContextType = {
  call: Call | null;
  answerCall: () => void;
  hangupCall: () => void;
  sendDtmf: (tone: string | number) => void;
  toggleHold: () => void;
  toggleMicro: () => void;
  toggleAudio: () => void;
  toggleCamera: () => void;
}

export const CallContext = createContext<CallContextType>({
  call: null,
  answerCall: () => { throwInitError(); },
  hangupCall: () => { throwInitError(); },
  sendDtmf: () => { throwInitError(); },
  toggleHold: () => { throwInitError(); },
  toggleMicro: () => { throwInitError(); },
  toggleAudio: () => { throwInitError(); },
  toggleCamera: () => { throwInitError(); },
});

function throwInitError() {
  throw new Error("CallProvider not initialized");
}
