import { FC, useRef, ReactNode, MouseEvent } from "react";
import { styled } from "@linaria/react";
import { IoClose } from "react-icons/io5";
import TransparentRoundButton from "components/common/button/TransparentRoundButton";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const OuterContainer = styled.div<{ bg: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.bg};
`;

const InnerContainer = styled.div<{ bg: string }>`
  z-index: 100;
  position: relative;
  padding: 15px;
  border-radius: 12px;
  background-color: ${p => p.bg};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
`;


interface Props {
  children: ReactNode;
  close?: () => void;
}

const Window: FC<Props> = ({ children, close }) => {
  const th = useTheme();
  const backgroundRef = useRef(null);

  const handleClickOnBack = (event: MouseEvent) => {
    if (close && event.target === backgroundRef.current) {
      close();
    }
  }

  return (
    <OuterContainer
      bg={th.colors.bgHover}
      onClick={handleClickOnBack}
      onMouseEnter={e => e.preventDefault()}
      onMouseOut={e => e.preventDefault()}
      ref={backgroundRef}
    >
      <InnerContainer bg={th.colors.surface1}>
        {close && (
          <CloseButtonContainer>
            <TransparentRoundButton onClick={close}>
              <IoClose size={font.size.l}/>
            </TransparentRoundButton>
          </CloseButtonContainer>
        )}
        {children}
      </InnerContainer>
    </OuterContainer>
  );
}

export default Window;
