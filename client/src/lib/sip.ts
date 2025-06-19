import { UA, WebSocketInterface } from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import { RefObject } from "react";

export interface SipAccount {
  readonly username: string;
  readonly password: string;
  readonly domain: string;
  readonly proxy: string;
}

export class StateWrapper<T> {
  constructor(readonly state: T) {}

  is(state: T): boolean { return this.state === state; }
}

export enum ConnectionState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}

export class ConnectionStateWrapper extends StateWrapper<ConnectionState> {
  isConnecting(): boolean { return this.is(ConnectionState.CONNECTING); }
  isConnected(): boolean { return this.is(ConnectionState.CONNECTED); }
  isDisconnected(): boolean { return this.is(ConnectionState.DISCONNECTED); }
}

export enum CallState {
  PROGRESS = "progress",
  ESTABLISHED = "established",
  ENDED = "ended",
}

export class CallStateWrapper extends StateWrapper<CallState> {
  isOnProgress(): boolean { return this.is(CallState.PROGRESS); }
  isEstablished(): boolean { return this.is(CallState.ESTABLISHED); }
  isEnded(): boolean { return this.is(CallState.ENDED); }
}

export enum CallOriginator {
  LOCAL = "local",
  REMOTE = "remote",
}

export function getCallOriginator(originator: string): CallOriginator | undefined {
  switch(originator) {
    case "local": return CallOriginator.LOCAL;
    case "remote": return CallOriginator.REMOTE;
    default: return void 0;
  }
}

export enum CallDirection {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
}

export type Session = {
  readonly session: RTCSession;
  readonly info: CallInfo;
}

export interface CallInfo {
  readonly id: string;
  readonly number: string;
  readonly state: CallState;
  readonly direction: CallDirection;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly startedBy: CallOriginator;
  readonly endedBy?: CallOriginator;
  readonly volume: boolean;
  readonly isMuted: boolean;
  readonly isOnHold: boolean;
  readonly error?: string;
  readonly remoteStream?: MediaStream;
}

export interface Call {
  readonly id: string;
  readonly number: string;
  readonly state: CallStateWrapper;
  readonly direction: CallDirection;
  readonly startTime: Date;
  readonly endTime?: Date;
  readonly startedBy: CallOriginator;
  readonly endedBy?: CallOriginator;
  readonly volume: boolean;
  readonly isMuted: boolean;
  readonly isOnHold: boolean;
  readonly error?: string;
  readonly remoteStream?: MediaStream;
}

export type IncomingCallHandler = (id: string) => void;

export function init(account: SipAccount): UA {
  const socket = new WebSocketInterface(`wss://${account.proxy}`);

  const configuration = {
    sockets: [socket],
    session_timers: false,
    uri: `${account.username}@${account.domain}`,
    password: account.password,
  };

  return new UA(configuration);
}
