import { createContext } from "react";
import { Theme, LightTheme } from "../styles";

export const ThemeContext = createContext<Theme>(LightTheme);
