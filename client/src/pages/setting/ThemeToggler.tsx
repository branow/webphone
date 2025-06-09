import { FC, useContext } from "react";
import { css, cx } from "@linaria/core";
import { styled } from "@linaria/react";
import { CiLight, CiDark } from "react-icons/ci";
import { ThemeContext } from "context/ThemeContext";
import { DarkTheme, font, LightTheme } from "styles";

const Container = styled.div<{ size: number, bg: string }>`
  transition: all 0.5s;
  position: relative;
  height: ${p => p.size}px;
  width: ${p => p.size * 1.75}px;
  padding: ${p => p.size * 0.1}px;
  box-sizing: border-box;
  border-radius: ${p => p.size}px;
  background-color: ${p => p.bg};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Slide = styled.div<{ size: number, bg: string }>`
  transition: all 0.5s;
  height: ${p => p.size * 0.9}px;
  min-height: ${p => p.size * 0.9}px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: ${p => p.bg};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const cssChecked = css`
  transform: translateX(75%);
`;

interface Props {
}

const ThemeToggler: FC<Props> = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const size = font.size.x4l;
  const color = theme.colors.yellow;

  const checked = theme === DarkTheme;

  return (
    <Container
      size={size}
      bg={color}
      onClick={() => setTheme(checked ? LightTheme : DarkTheme)}
    >
      <Slide
        className={cx(checked && cssChecked)}
        size={size}
        bg={theme.colors.surface1}
      >
        {!checked && <CiLight size={font.size.xl} color={theme.colors.yellow} />}
        {checked && <CiDark size={font.size.xl} color={theme.colors.yellow} />}
      </Slide>
    </Container>
  );
};

export default ThemeToggler;
