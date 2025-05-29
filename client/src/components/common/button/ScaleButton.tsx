import { FC, HTMLAttributes, ReactNode } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "../../../hooks/useTheme";

const ButtonContainer = styled.div<{ size: number }>`
  position: relative;
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface ButtonProps {
  size: number;
  scale: number;
  color: string;
  bg: string;
  bgHover: string;
  bgDisabled: string;
  shadow: string;
}

const Button = styled.button<ButtonProps>`
  position: absolute;
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  border: none;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  color: ${p => p.color};
  background-color: ${p => p.bg};
  box-shadow: 0 0 6px 8px ${p => p.shadow};
  transition: all ease-in-out 0.25s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:not(:disabled):hover {
    background-color: ${p => p.bgHover};
    transform: scale(${p => p.scale});
  }

  &:not(:disabled):active {
    color: ${p => p.color};
    background-color: ${p => p.bg};
  }

  &:disabled {
    background-color: ${p => p.bgDisabled};
  }
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: number;
  scale?: number;
  disabled?: boolean;
  color?: string;
  bg?: string;
  bgHover?: string;
}

const ScaleButton: FC<Props> = (props) => {
  const { children, size, scale, color, bg, bgHover, ...buttonProps } = props;

  const sizeValue = size ?? 50;
  const scaleValue = scale ?? 1.1;

  const th = useTheme();

  return (
    <ButtonContainer size={sizeValue * scaleValue + 12}>
      <Button
        size={sizeValue}
        scale={scaleValue}
        color={color ?? th.colors.iconLight}
        bg={bg ?? th.colors.blue}
        bgHover={bgHover ?? th.colors.blueHover}
        bgDisabled={th.colors.bgDisabled}
        shadow={th.colors.bgDisabled}
        {...buttonProps}
      >
        {children}
      </Button>
    </ButtonContainer>
  );
};

export default ScaleButton;
