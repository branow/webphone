import { FC } from "react";
import { styled } from "@linaria/react";
import { font } from "../../../styles";
import { useTheme } from "../../../hooks/useTheme";
import { css, cx } from "@linaria/core";

const Container = styled.div<{ size: number, bg: string }>`
  transition: all 0.5s;
  position: relative;
  height: ${p => p.size}px;
  width: ${p => p.size * 1.8}px;
  padding: ${p => p.size * 0.15}px;
  box-sizing: border-box;
  border-radius: ${p => p.size}px;
  background-color: ${p => p.bg};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Slide = styled.div<{ size: number, bg: string }>`
  transition: all 0.5s;
  height: ${p => p.size * 0.75}px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: ${p => p.bg};
`;

const cssChecked = css`
  transform: translateX(100%);
`;

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
  color?: string;
}

const Toggler: FC<Props> = ({ checked, onChange, size, color }) => {
  const th = useTheme();

  size = size || font.size.xl;
  color = color || th.colors.blue; 

  return (
    <Container
      size={size}
      bg={checked ? color : th.colors.iconGray}
      onClick={() => onChange(!checked)}
    >
      <Slide
        className={cx(checked && cssChecked)}
        size={size}
        bg={th.colors.surface1}
      />
    </Container>
  );
};

export default Toggler;
