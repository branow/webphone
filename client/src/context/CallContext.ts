import { createContext } from "react";
import { Call } from "lib/sip";

export type CallContextType = {
  call: Call | null;
  answerCall: () => void;
  hangupCall: () => void;
  sendDtmf: (tone: string | number) => void;
  toggleHold: () => void;
  toggleMute: () => void;
  toggleAudio: () => void;
}

export const CallContext = createContext<CallContextType>({
  call: null,
  answerCall: () => { throwInitError(); },
  hangupCall: () => { throwInitError(); },
  sendDtmf: () => { throwInitError(); },
  toggleHold: () => { throwInitError(); },
  toggleMute: () => { throwInitError(); },
  toggleAudio: () => { throwInitError(); },
});

function throwInitError() {
  throw new Error("CallProvider not initialized");
}
