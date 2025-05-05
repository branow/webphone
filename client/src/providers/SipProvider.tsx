import { FC, createContext, useRef, useState, useEffect, useContext, ReactNode } from "react";
import JsSIP from "jssip";
import { AuthContextType, AuthContext } from "./AuthProvider";
import Storage from "../lib/storage.ts";

export enum ConnectionState {
  FETCHING = "fetching",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "connected",
}

export enum RegistrationState {
  REGISTERED = "registered",
  UNREGISTERED = "unregistered",
}

export interface SipAccount {
  username: string;
  password: string;
  domain: string;
  proxy: string;
}

export const SipAccountStorage = new Storage<SipAccount>("sip.account");

interface SipValue {
  ua: JsSIP.UA | null;
  sipAccount: SipAccount | null;
  connectionState: ConnectionState;
  connectionFailed: string;
  registrationState: RegistrationState;
  registrationFailed: string;
  register: (sa: SipAccount) => void;
}

export const SipContext = createContext<SipValue | null>(null);

interface SipState {
  ua: JsSIP.UA | null;
  sipAccount: SipAccount | null;
  connectionState: ConnectionState;
  connectionFailed: string;
  registrationState: RegistrationState;
  registrationFailed: string;
}

const initialSipState: SipState = {
  ua: null,
  sipAccount: null,
  connectionState: ConnectionState.DISCONNECTED,
  connectionFailed: "",
  registrationState: RegistrationState.UNREGISTERED,
  registrationFailed: "",
}

interface Props {
  children: ReactNode;
}

const SipProvider: FC<Props> = ({ children }) => {
  const [sipState, setSipState] = useState<SipState>(initialSipState);
  // Using Ref because of loosing sip state data during frequent 
  // react state updates.
  const sipStateRef = useRef<SipState>(initialSipState);
  const { authenticated } = useContext<AuthContextType | null>(AuthContext)!;

  useEffect(() => {
    if (!authenticated) return;

    const savedSipAccount = SipAccountStorage.get();
    if (savedSipAccount) {
      register(savedSipAccount);
    } else {
      setSipState({...sipState, connectionState: ConnectionState.FETCHING });
      fetch("/sip-credentials").then(response => {
        if (response.status === 200) {
          const fetchedSipAccount: SipAccount = {
            username: response.headers.get("x-sip-username") || "",
            password: response.headers.get("x-sip-password") || "",
            domain: response.headers.get("x-sip-domain") || "",
            proxy: response.headers.get("x-sip-proxy") || "",
          }
          register(fetchedSipAccount);
        }
      }).catch(error => {
        setSipState({...sipState, connectionState: ConnectionState.FETCHING });
        console.error(error);
      });
    }
  }, [authenticated]);

  const register = (newSipAccount: SipAccount) => {
    const socket 
      = new JsSIP.WebSocketInterface(`wss://${newSipAccount.proxy}`);
    const configuration = {
      sockets: [socket],
      session_timers: false,
      uri: `${newSipAccount.username}@${newSipAccount.domain}`,
      password: newSipAccount.password,
    };
    
    const changeState = (newState: any) => {
      sipStateRef.current = { ...sipStateRef.current, ...newState };
      setSipState(sipStateRef.current);
    }

    try {
      const ua = new JsSIP.UA(configuration);

      ua.on("connecting", (e) => {
        log("connecting", e);
        changeState({
          connectionState: ConnectionState.CONNECTING,
          connectionFailed: "",
        });
      });

      ua.on("connected", (e) => {
        log("connected", e);
        changeState({ connectionState: ConnectionState.CONNECTED });
      });

      ua.on("disconnected", (e) => {
        log("disconnected", e);
        let message = "";
        if (e.error) {
          message = "Connection failed: invalid proxy";
          ua.stop();
        }
        changeState({
          connectionState: ConnectionState.DISCONNECTED,
          connectionFailed: message,
        });
      });

      ua.on("registered", (e) => {
        log("registered", e);
        changeState({ registrationState: RegistrationState.REGISTERED });
        SipAccountStorage.set(newSipAccount);
      });

      ua.on("unregistered", (e) => {
        log("unregistered", e);
        changeState({ registrationState: RegistrationState.UNREGISTERED });
      });

      ua.on("registrationFailed", (e) => {
        log("registrationFailed", e);
        changeState({
          registrationState: RegistrationState.UNREGISTERED,
          registrationFailed: "Registration failed: invalid username, password or domain",
        });
      });

      ua.start();
      changeState({ sipAccount: newSipAccount, ua: ua });

    } catch (error) {
      console.error(error);
      const message = (error as Error).message;
      changeState({
        connectionState: ConnectionState.DISCONNECTED,
        connectionFailed: message,
      });
    }
  }

  return (
    <SipContext.Provider
      value={{
        ua: sipState.ua,
        sipAccount: sipState.sipAccount,
        register,
        connectionState: sipState.connectionState,
        connectionFailed: sipState.connectionFailed,
        registrationState: sipState.registrationState,
        registrationFailed: sipState.registrationFailed,
      }}
    >
      {children}
    </SipContext.Provider>
  );
};

function log(...data: any[]) {
  if (import.meta.env.WEBPHONE_PROFILE === "dev") {
    console.log(...data);
  }
}

export default SipProvider;
