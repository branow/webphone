import { FC, HTMLAttributes, ReactNode } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "../../../hooks/useTheme";

interface StyledTransparentClickableContainerProps {
  hoverBg: string;
  activeBg: string;
  disabledBg: string;
  color: string;
  disabledColor: string;
}

const StyledTransparentClickableContainer = styled.div<StyledTransparentClickableContainerProps>`
  cursor: pointer;
  border: none;
  border-radius: 10%;
  text-decoration: none;
  color: ${props => props.color};
  background-color: #0000;
  transition: all ease-in-out 0.3s;

  &:not(:disabled):hover {
    background-color: ${props => props.hoverBg};
    box-shadow: 0 0 4px 2px ${props => props.hoverBg};
  }

  &:not(:disabled):active {
    background-color: ${props => props.activeBg};
    box-shadow: 0 0 4px 2px ${props => props.activeBg};
  }

  &:disabled {
    background-color: ${props => props.disabledBg};
    color: ${props => props.disabledColor};
    box-shadow: 0 0 4px 2px ${props => props.disabledBg};
  }
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const TransparentClickableContainer: FC<Props> = (props) => {
  const th = useTheme();
  return (
    <StyledTransparentClickableContainer
      hoverBg={th.colors.bgHover}
      activeBg={th.colors.bgActive}
      disabledBg={th.colors.bgDisabled}
      color={th.colors.text}
      disabledColor={th.colors.textDisabled}
      {...props}
    >
      {props.children}
    </StyledTransparentClickableContainer>
  );
}

export default TransparentClickableContainer;
