import { createContext } from "react";

export type Page = {
  location: string;
  path: string;
}

export type PageSwitcherContextType = {
  current: Page;
  previous?: Page;
}

export const PageSwitcherContext = createContext<PageSwitcherContextType>({
  current: {
    location: "",
    path: "/",
  }
});
