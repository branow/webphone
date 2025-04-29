import { FC, ReactNode, createContext, useContext, useState, useEffect } from "react";
import { SipContext } from "./SipProvider";
import { RTCSession } from "jssip/lib/RTCSession";
import { IncomingRequest, OutgoingRequest } from "jssip/lib/SIPMessage";
import { IncomingRTCSessionEvent, OutgoingRTCSessionEvent } from "jssip/lib/UA";

interface Props {
  children: ReactNode;
}

export enum CallState {
  PROGRESS = "progress",
  FAILED = "failed",
  CONFIRMED = "confirmed",
  HOLD = "hold",
  ENDED = "ended",
}

export enum CallDirection {
  INCOMING = "incoming",
  OUTCOMING = "outcoming",
}

export enum CallAgent {
  LOCAL = "local",
  REMOTE = "remote",
}

interface CallInfo {
  startedBy: CallAgent;
  number: string;
  state: CallState;
  isMuted: boolean;
  startDate: Date;
  stream?: MediaStream;
  endDate?: Date;
  endedBy?: CallAgent;
}

export interface Call extends CallInfo {
  muteMicro: (mute: boolean) => void;
  sendDTMF: (tone: string | number) => void;
  answer: () => void;
  terminate: () => void;
}

interface Value {
  call: Call | null;
  doCall: (number: string) => void;
}

export const CallContext = createContext<Value | null>(null);

let session: RTCSession | null = null;

const CallProvider: FC<Props> = ({ children }) => {
  const { ua } = useContext(SipContext)!;
  const [callState, setCallState] = useState<CallInfo | null>(null);

  useEffect(() => {
    if (ua == null) return;

    ua!.on("newRTCSession",
      (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) => {
      let originator = event.originator;
      session = event.session as RTCSession;
      let request = event.request as IncomingRequest | OutgoingRequest;

      // Hide the initial callState var, because of loosing
      // data during frequent react state updating.
      let callState: CallInfo = {
        startedBy: originator === "local" ? CallAgent.LOCAL : CallAgent.REMOTE,
        number: request.ruri.user,
        state: CallState.PROGRESS,
        startDate: new Date(),
        isMuted: session.isMuted().audio,
      }
      setCallState(callState);

      const changeState = (newState: any) => {
        const newCallState = { ...callState, ...newState }
        callState = newCallState;
        setCallState(newCallState);
      } 

      session.connection.ontrack = (event) => {
        const remoteStream = new MediaStream();
        event.streams[0]?.getTracks()
          .forEach((track) => remoteStream.addTrack(track));

        console.log('call provider add stream', remoteStream);
        changeState({ stream: remoteStream });
      }

      session.on("peerconnection", (e) => {
        console.log("peerconneciton", e, callState);
      });

      session.on("connecting", (e) => {
        console.log("connecting", e, callState);
      });

      session.on("sending", (e) => {
        console.log("sending", e, callState);
      });

      session.on("progress", (e: any) => {
        console.log("progress", e, callState);
        changeState({ state: CallState.PROGRESS });
      });

      session.on("accepted", (e: any) => {
        console.log("accepted", e, callState);
      });

      session.on("confirmed", (e: any) => {
        console.log("comfirmed", e, callState);
        changeState({ state: CallState.CONFIRMED });
      });

      session.on("ended", (e) => {
        console.log("ended", e, callState);
        const endDate = callState.state === CallState.CONFIRMED ? new Date() : undefined;
        const endedBy = e.originator === "local" ? CallAgent.LOCAL : CallAgent.REMOTE;
        changeState({ state: CallState.ENDED, endDate, endedBy });
      });

      session.on("failed", (e) => {
        console.log("failed", e);
        const endDate = callState.state === CallState.CONFIRMED ? new Date() : undefined;
        changeState({ state: CallState.FAILED, endDate });
      });

      session.on("hold", (e) => {
        console.log("hold", e);
        changeState({ state: CallState.HOLD });
      });

      session.on("unhold", (e) => {
        console.log("unhold", e);
        changeState({ state: CallState.CONFIRMED });
      });
    });

    return () => { ua!.removeAllListeners(); }
  }, [ua]);

  const doCall = (number: string) => {
    console.log("do call:", number);
    const options = {
      "mediaConstraints": { "audio": true }
    }
    ua!.call(number, options);
  }

  const answer = () => {
    if (session) {
      session.answer();
    }
  }

  const sendDTMF = (tone: string | number) => {
    if (session) {
      session.sendDTMF(tone);
    }
  }

  const muteMicro = (mute: boolean) => {
    if (session) {
      if (mute) {
        session.mute();
      } else {
        session.unmute();
      }
      setCallState({
        ...callState!,
        isMuted: session.isMuted().audio,
      });
    }
  }

  const terminate = () => {
    if (session) {
      console.log("terminate session");
      session.terminate();
    }
  }

  let call: Call | null = null;
  if (callState) {
    call = {
      ...callState,
      muteMicro,
      sendDTMF,
      answer,
      terminate,
    }
  }

  return (
    <CallContext.Provider value={{ call, doCall }}>
      {children}
    </CallContext.Provider>
  );
};

export default CallProvider;
