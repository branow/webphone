import { FC, createContext, useState, useEffect, ReactNode } from "react";
import JsSIP from "jssip";
import Storage from "../../lib/storage.ts";

export enum ConnectionState {
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

  useEffect(() => {
    const savedSipAccount = SipAccountStorage.get();
    if (savedSipAccount) {
      register(savedSipAccount);
    }
  }, []);

  const register = (newSipAccount: SipAccount) => {
    const socket 
      = new JsSIP.WebSocketInterface(`wss://${newSipAccount.proxy}`);
    const configuration = {
      sockets: [socket],
      session_timers: false,
      uri: `${newSipAccount.username}@${newSipAccount.domain}`,
      password: newSipAccount.password,
    };
    
    // Shadow the sipState value, bacuse of loosing data during frequent 
    // react state updating.
    let sipState: SipState = { ...initialSipState };
    setSipState(sipState);

    const changeState = (newState: any) => {
      const newSipState = { ...sipState, ...newState };
      sipState = newSipState;
      setSipState(newSipState);
    }

    try {
      const ua = new JsSIP.UA(configuration);

      ua.on("connecting", (e) => {
        console.log("connecting", e);
        changeState({
          connectionState: ConnectionState.CONNECTING,
          connectionFailed: "",
        });
      });

      ua.on("connected", (e) => {
        console.log("connected", e);
        changeState({ connectionState: ConnectionState.CONNECTED });
      });

      ua.on("disconnected", (e) => {
        console.log("disconnected", e);
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
        console.log("registered", e);
        changeState({ registrationState: RegistrationState.REGISTERED });
        SipAccountStorage.set(newSipAccount);
      });

      ua.on("unregistered", (e) => {
        console.log("unregistered", e);
        changeState({ registrationState: RegistrationState.UNREGISTERED });
      });

      ua.on("registrationFailed", (e) => {
        console.log("registrationFailed", e);
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

export default SipProvider;
