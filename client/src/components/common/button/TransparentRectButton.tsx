import { FC, HTMLAttributes, ReactNode } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";

interface StyledTransparentRectButtonProps {
  bgHover: string;
  bgActive: string;
  bgDisabled: string;
  color: string;
  colorHover: string;
  colorActive: string;
  colorDisabled: string;
}

const StyledTransparentRectButton = styled.button<StyledTransparentRectButtonProps>`
  cursor: pointer;
  border: none;
  text-decoration: none;
  color: ${props => props.color};
  background-color: #0000;
  transition: all ease-in-out 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:not(:disabled):hover {
    color: ${props => props.colorHover};
    background-color: ${props => props.bgHover};
    box-shadow: 0 0 4px 2px ${props => props.bgHover};
  }

  &:not(:disabled):active {
    color: ${props => props.colorActive};
    background-color: ${props => props.bgActive};
    box-shadow: 0 0 4px 2px ${props => props.bgActive};
  }

  &:disabled {
    color: ${props => props.colorDisabled};
    cursor: auto;
  }
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: string;
  colorHover?: string;
  colorDisabled?: string;
  colorActive?: string;
  disabled?: boolean;
}

const TransparentRectButton: FC<Props> = (props) => {
  const th = useTheme();

  return (
    <StyledTransparentRectButton
      bgHover={th.colors.bgHover}
      bgActive={th.colors.bgActive}
      bgDisabled={th.colors.bgDisabled}
      color={props.color ?? th.colors.subtitle}
      colorHover={props.colorHover ?? th.colors.title}
      colorActive={props.colorActive ?? th.colors.text}
      colorDisabled={props.colorDisabled ?? th.colors.textDisabled}
      {...props}
    >
      {props.children}
    </StyledTransparentRectButton>
  );
}

export default TransparentRectButton;
