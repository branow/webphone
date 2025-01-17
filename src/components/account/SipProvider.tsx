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

interface Sip {
  sipAccount: SipAccount | null;
  connectionState: ConnectionState;
  connectionFailed: string;
  registrationState: RegistrationState;
  registrationFailed: string;
  register: (sa: SipAccount) => void;
}

export const SipContext = createContext<Sip | null>(null);

interface Props {
  children: ReactNode;
}

const SipProvider: FC<Props> = ({ children }) => {
  const [sipAccount, setSipAccount] = useState<SipAccount | null>(null);
  const [connectionState, setConnectionState] 
    = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [registrationState, setRegistrationState] 
    = useState<RegistrationState>(RegistrationState.UNREGISTERED);
  const [connectionFailed, setConnectionFailed] = useState<string>("");
  const [registrationFailed, setRegistrationFailed] = useState<string>("");

  useEffect(() => {
    const savedSipAccount = SipAccountStorage.get();
    if (savedSipAccount) {
      register(savedSipAccount);
    }
  }, []);

  const register = (newSipAccount: SipAccount) => {
    setSipAccount(newSipAccount);

    const socket 
      = new JsSIP.WebSocketInterface(`wss://${newSipAccount.proxy}`);
    const configuration = {
      sockets: [socket],
      session_timers: false,
      uri: `${newSipAccount.username}@${newSipAccount.domain}`,
      password: newSipAccount.password,
    };
    
    try {
      const ua = new JsSIP.UA(configuration);

      ua.on("connecting", (e) => {
        console.log("connecting", e);
        setConnectionState(ConnectionState.CONNECTING);
        setConnectionFailed("");
      });

      ua.on("connected", (e) => {
        console.log("connected", e);
        setConnectionState(ConnectionState.CONNECTED);
      });

      ua.on("disconnected", (e) => {
        console.log("disconnected", e);
        setConnectionState(ConnectionState.DISCONNECTED);
        if (e.error) {
          const message = "Connection failed: invalid proxy";
          setConnectionFailed(message);
          ua.stop();
        }
      });

      ua.on("registered", (e) => {
        console.log("registered", e);
        setRegistrationState(RegistrationState.REGISTERED);
        SipAccountStorage.set(newSipAccount);
      });

      ua.on("unregistered", (e) => {
        console.log("unregistered", e);
        setRegistrationState(RegistrationState.UNREGISTERED);
      });

      ua.on("registrationFailed", (e) => {
        console.log("registrationFailed", e);
        setRegistrationState(RegistrationState.UNREGISTERED);
        setRegistrationFailed("Registration failed: invalid username, password or domain");
      });

      ua.start();
    } catch (error) {
      console.error(error);
      const message = (error as Error).message;
      setRegistrationFailed(message);
    }
  }

  return (
    <SipContext.Provider 
      value={{ 
        sipAccount,
        register,
        connectionState,
        connectionFailed,
        registrationState,
        registrationFailed,
      }}
    >
      {children}
    </SipContext.Provider>
  );
};

export default SipProvider;
