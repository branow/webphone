import { FC, ReactNode } from "react";
import { Outlet } from "react-router";
import { styled } from "@linaria/react";
import NavBar from "components/navbar/NavBar";
import SipEventsHandler from "components/sip/SipEventsHandler";
import CallBar from "components/sip/CallBar";
import { size } from "styles";

const NavBarContainer = styled.div`
  height: ${size.navbar.h}px;
`

const MainContainer = styled.main`
  position: relative;
  height: ${size.phone.h - size.navbar.h}px;
`
interface Props {
  children?: ReactNode;
}

const PhoneLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <SipEventsHandler />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
      <CallBar />
      <MainContainer>
        <Outlet />
        {children}
      </MainContainer>
    </>
  );
}

export default PhoneLayout;
