import { FC, ReactNode, useState, useEffect, useCallback } from "react";
import { ThemeContext } from "context/ThemeContext";
import { DarkTheme, LightTheme, Theme } from "styles";
import Storage from "lib/storage";

interface Props {
  children: ReactNode;
}

const storage = new Storage("theme");

const ThemeProvider: FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState(LightTheme);

  // Determine and apply theme
  useEffect(() => {
    const themeName = storage.get();
    if (themeName === "light") setTheme(LightTheme);
    else if (themeName === "dark") setTheme(DarkTheme);
    else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) setTheme(LightTheme);
  }, []);

  // Watch system preference
  useEffect(() => {
    if (storage.get()) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) =>
        event.matches ? setTheme(DarkTheme) : setTheme(LightTheme);

    mediaQuery.addEventListener("change", listener);
    return mediaQuery.removeEventListener("change", listener);
  }, []);

  const setGlobalTheme = useCallback((theme: Theme) => {
    storage.set(theme === LightTheme ? "light" : "dark");
    setTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setGlobalTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
