import { useEffect, useState, useRef } from "react";
import { UA } from "jssip";
import { RTCSessionEvent } from "jssip/lib/UA";
import { IncomingAckEvent, IncomingEvent, OutgoingAckEvent, OutgoingEvent, RTCSession } from "jssip/lib/RTCSession";
import { IncomingRequest, OutgoingRequest } from "jssip/lib/SIPMessage";
import { ConnectionState, IncomingCallHandler, CallInfo, SipAccount, init, CallState, CallDirection, Call, ConnectionStateWrapper, Session, CallStateWrapper, getCallOriginator } from "../lib/sip";
import { log, warn } from "../util/log";

interface Return {
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
}

export function useSip(): Return {
  const [account, setAccount] = useState<SipAccount | null>(null);
  const [connection, setConnection] = useState(ConnectionState.DISCONNECTED);
  const [connectionError, setConnectionError] = useState<Error>();
  const [calls, setCalls] = useState(new Map<string, Session>());
  const handleIncomingCallRef = useRef<IncomingCallHandler>();
  const uaRef = useRef<UA>();

  useEffect(() => {
    if (!account) return;

    setConnectionError(undefined);

    uaRef.current = init(account);

    const ua = uaRef.current;

    ua.on("connecting", (e) => {
      log("CONNECTING", e);
      setConnection(ConnectionState.CONNECTING);
    });

    ua.on("connected", (e) => {
      log("CONNECTED", e);
      setConnection(ConnectionState.CONNECTING);
    });

    ua.on("disconnected", (e) => {
      log("DISCONNECTED", e);
      setConnection(ConnectionState.DISCONNECTED);
      const error = Error(e.reason || "PBX Server Disconnected");
      if (e.code) error.name = String(e.code);
      setConnectionError(error);
      if (e.error) ua.stop();
    });

    ua.on("registered", (e) => {
      log("REGISTERED", e);
      setConnection(ConnectionState.CONNECTED);
    });

    ua.on("unregistered", (e) => {
      log("UNREGISTRED", e);
      setConnection(ConnectionState.DISCONNECTED);
    });

    ua.on("registrationFailed", (e) => {
      log("REGISTRATION_FAILED", e);
      setConnection(ConnectionState.DISCONNECTED);

      const error = new Error(e.response.reason_phrase);
      error.name = e.cause || String(e.response.status_code);
      setConnectionError(error);
    });

    ua.on("newRTCSession", (e: RTCSessionEvent) => {
      log("NEW_RTC_SESSION", e);
      const session = e.session;
      const callId =  addCall(session, e.request, e.originator);

      if (e.originator === "remote" && handleIncomingCallRef.current) {
        handleIncomingCallRef.current(callId);
      }

      if (session.connection) {
        session.connection.ontrack = (e) => handleTracks(callId, e);
      }

      session.on("peerconnection", (e) => {
        log("peerconneciton", e);
        e.peerconnection.ontrack = (event) => handleTracks(callId, event);
      });

      session.on("connecting", (e) => {
        log("connecting", e);
      });

      session.on("sending", (e) => {
        log("sending", e);
      });

      session.on("progress", (e: IncomingEvent | OutgoingEvent) => {
        log("progress", e);
      });

      session.on("accepted", (e: IncomingEvent | OutgoingEvent) => {
        log("accepted", e);
      });

      session.on("confirmed", (e: IncomingAckEvent | OutgoingAckEvent) => {
        log("comfirmed", e);
        updateCall(callId, call => ({ ...call, state: CallState.ESTABLISHED }));
      });

      session.on("hold", (e) => {
        log("hold", e);
        updateCall(callId, call => ({ ...call, isOnHold: true }));
      });

      session.on("unhold", (e) => {
        log("unhold", e);
        updateCall(callId, call => ({ ...call, isOnHold: false }));
      });

      session.on("muted", (e) => {
        log("muted", e);
        updateCall(callId, call => ({ ...call, isMuted: true }));
      });

      session.on("unmuted", (e) => {
        log("unmuted", e);
        updateCall(callId, call => ({ ...call, isMuted: false }));
      });

      session.on("ended", (e) => {
        log("ended", e);
        const endTime = new Date();
        const endedBy = getCallOriginator(e.originator);
        const state = CallState.ENDED;
        const remoteStream = undefined;
        updateCall(callId, call => ({ ...call, state, remoteStream, endTime, endedBy }));
        scheduleCallRemoval(callId);
      });

      session.on("failed", (e) => {
        log("failed", e);
        const endTime = new Date();
        const endedBy = getCallOriginator(e.originator);
        const state = CallState.ENDED;
        const remoteStream = undefined;
        const error = e.cause;
        updateCall(callId, call => ({ ...call, state, remoteStream, endTime, endedBy, error }))
        scheduleCallRemoval(callId);
      });

    });

    ua.start();

    return () => {
      ua.stop();
      ua.removeAllListeners();
    };

  }, [account]);

  const handleTracks = (callId: string, e: RTCTrackEvent) => {
    updateCall(callId, call => {
      e.streams[0]?.getTracks()
        .filter(track => call.remoteStream && !call.remoteStream.getTrackById(track.id))
        .forEach(track => call.remoteStream?.addTrack(track));
      return call;
    });
  }

  const addCall = (session: RTCSession, request: IncomingRequest | OutgoingRequest, originator: string): string => {
    const number = originator == "local" ?
      (request?.ruri?.user || "unknown") :
      (request?.from?.uri?.user || "unknown");
    const info = {
      id: session.id,
      number: number,
      state: CallState.PROGRESS,
      direction: originator == "local" ? CallDirection.OUTGOING : CallDirection.INCOMING,
      startTime: session.start_time || new Date(),
      isOnHold: session.isOnHold().local,
      isMuted: session.isMuted().audio,
      startedBy: getCallOriginator(originator)!,
      remoteStream: new MediaStream(),
    }
    setCalls((calls) => {
      if (calls.get(info.id)) { warn(`Cannot add call with dublicate id: ${info.id}`); return calls; }
      const newCalls = new Map(calls);
      newCalls.set(info.id, { session, info });
      return newCalls;
    });
    return info.id;
  }

  const updateCall = (id: string, updateFunc: (c: CallInfo) => CallInfo) => {
    setCalls(calls => {
      const call = calls.get(id)
      if (!call) { warn("Cannot update unexisting call:", id); return calls; }
      const newCalls = new Map(calls);
      newCalls.set(id, { ...call, info: updateFunc(call.info) });
      return newCalls;
    });
  }

  const removeCall = (id: string) => {
    setCalls(calls => {
      const call = calls.get(id)
      if (!call) { warn(`Cannot remove unexisting call: ${id}`); return calls; }
      if (call.info.state !== CallState.ENDED) { warn(`Cannot remove active call: ${id} - ${call.info.state}`); return calls; }
      call.session.removeAllListeners();
      const newCalls = new Map(calls);
      newCalls.delete(id);
      return newCalls;
    });
  }

  const scheduleCallRemoval = (id: string) => {
    setTimeout(() => removeCall(id), 3600 * 1000);
  }

  const makeCall = (number: string): void => {
    if (!uaRef.current) { warn("Cannot make call as UA is undefined"); return; }
    uaRef.current.call(number, { "mediaConstraints": { "audio": true } });
  }

  const onIncomingCall = (handler: IncomingCallHandler): void => {
    handleIncomingCallRef.current = handler;
  }

  const answerCall = (id: string): void => {
    const call = calls.get(id);
    if (!call) { warn(`Cannot answer unexisting call: ${id}`); return; }
    call.session.answer();
  }

  const hangupCall = (id: string): void => {
    const call = calls.get(id);
    if (!call) { warn(`Cannot hangup unexisting call: ${id}`); return; }
    call.session.terminate();
  }

  const sendDtmf = (id: string, tone: string | number): void => {
    const call = calls.get(id);
    if (!call) { warn(`Cannot sendDtmf to unexisting call: ${id}`); return; }
    call.session.sendDTMF(tone);
  }

  const toggleHold = (id: string) => {
    const call = calls.get(id);
    if (!call) { warn(`Cannot toggle hold on unexisting call: ${id}`); return; }
    if (call.session.isOnHold().local) {
      call.session.unhold();
    } else {
      call.session.hold();
    }
  }

  const toggleMute = (id: string) => {
    const call = calls.get(id);
    if (!call) { warn(`Cannot toggle mute on unexisting call: ${id}`); return; }
    if (call.session.isMuted().audio) {
      call.session.unmute({ audio: true });
    } else {
      call.session.mute({ audio: true });
    }
  }

  return {
    account,
    setAccount,
    connection: new ConnectionStateWrapper(connection),
    connectionError,
    calls: mapCalls(calls),
    makeCall,
    onIncomingCall,
    answerCall,
    hangupCall,
    sendDtmf,
    toggleHold,
    toggleMute,
  };
};

function mapCalls(calls: Map<string, Session>): Call[] {
  return Array.from(calls.values()).map(call => call.info).map(mapCall);
}

function mapCall(callInfo: CallInfo): Call {
  return { ...callInfo, state: new CallStateWrapper(callInfo.state) }
}
