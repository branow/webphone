import { FC, ReactNode, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface Props {
  children: ReactNode;
}

const ThemeProvider: FC<Props> = ({ children }) => {
  const theme = useContext(ThemeContext);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
