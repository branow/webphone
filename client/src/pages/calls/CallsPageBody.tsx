import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import { SipContext } from "context/SipContext";
import { size } from "styles";
import Calls from "./Calls";
import { Paths } from "routes";

const Container = styled.div`
  height: ${size.phone.h - size.navbar.h - size.calls.top.h}px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const CallsPageBody: FC = () => {
  const sipContext = useContext(SipContext);
  const calls = sipContext.calls.filter(call => !call.state.isEnded());

  const navigate = useNavigate();

  useEffect(() => {
    if (calls.length === 0) navigate(Paths.Dialpad());
  }, [calls]);

  return (
    <Container>
      <Calls calls={calls} />
    </Container>
  );
};

export default CallsPageBody;
