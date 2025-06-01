import { createContext } from "react";
import { Sip } from "../services/accounts";

export interface AccountContextType {
  user: string;
  username: string;
  isAdmin: boolean;
  account?: {
    id: string;
    user: string;
    username: string;
    active: boolean;
    isDefault: boolean;
    sip: Sip;
  };
}

export const AccountContext = createContext<AccountContextType>({
  user: "",
  username: "",
  isAdmin: false,
});
