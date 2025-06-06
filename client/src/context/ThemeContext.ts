import { createContext } from "react";
import { Theme, LightTheme } from "../styles";

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  setTheme: () => { throw new Error("ThemeProvider not initialized"); }
});
