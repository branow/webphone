import { createContext } from "react";

export type PrioritizedMessage = {
  priority: number;
  message: string;
}

export type ErrorContextType = {
  errors: Map<string, PrioritizedMessage>;
  remove: (key: string) => void;
  add: (key: string, message: PrioritizedMessage) => void;
}

export const ErrorContext = createContext<ErrorContextType>({
  errors: new Map(),
  remove: () => {},
  add: () => {},
});
