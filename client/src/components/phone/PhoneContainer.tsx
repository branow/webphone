import { FC, ReactNode } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";
import { size } from "styles";

interface Props {
  children: ReactNode;
}

const OuterContainer = styled.div<{ bg: string }>`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.bg};
`;

const InnerContainer = styled.div<{ bg: string }>`
  width: ${size.phone.w}px;
  height: ${size.phone.h}px;
  overflow: hidden;
  border-radius: 18px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  background: ${props => props.bg};
`;

const PhoneContainer: FC<Props> = ({ children }) => {
  const th = useTheme();

  return (
    <OuterContainer bg={th.colors.background}>
      <InnerContainer bg={th.colors.surface1}>
        {children}
      </InnerContainer>
    </OuterContainer>
  );
};

export default PhoneContainer;
