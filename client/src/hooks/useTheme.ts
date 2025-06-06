import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Theme } from "../styles";

export function useTheme(): Theme {
  const { theme } = useContext(ThemeContext);
  return theme;
}
