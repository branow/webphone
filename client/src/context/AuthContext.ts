import { createContext } from "react";
import { Role } from "../services/auth";

export interface AuthContextType {
  authenticated: boolean;
  user: string;
  username: string;
  isAdmin: boolean;
  role: Role;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  user: "",
  username: "",
  isAdmin: false,
  role: Role.User
});
