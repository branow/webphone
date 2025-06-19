import { createContext } from "react";
import { Call, ConnectionState, ConnectionStateWrapper, IncomingCallHandler, SipAccount } from "lib/sip";

export type SipContextType = {
  account: SipAccount | null;
  setAccount: (a: SipAccount) => void;
  connection: ConnectionStateWrapper;
  connectionError?: Error;
  calls: Call[];
  makeCall: (number: string) => void;
  onIncomingCall: (handler: IncomingCallHandler) => void;
  answerCall: (id: string) => void;
  hangupCall: (id: string) => void;
  sendDtmf: (id: string, tone: string | number) => void;
  toggleHold: (id: string) => void;
  toggleMute: (id: string) => void;
  toggleAudio: (id: string) => void;
}

export const SipContext = createContext<SipContextType>({
  account: null,
  setAccount: () => { throwInitError(); },
  connection: new ConnectionStateWrapper(ConnectionState.DISCONNECTED),
  calls: [],
  makeCall: () => { throwInitError(); },
  onIncomingCall: () => { throwInitError(); },
  answerCall: () => { throwInitError(); },
  hangupCall: () => { throwInitError(); },
  sendDtmf: () => { throwInitError(); },
  toggleHold: () => { throwInitError(); },
  toggleMute: () => { throwInitError(); },
  toggleAudio: () => { throwInitError(); },
});

function throwInitError() {
  throw new Error("SipProvider not initialized");
}
