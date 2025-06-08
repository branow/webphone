import { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import CallButton from "components/call/CallButton";
import HangUpButton from "components/call/HangUpButton";
import PendingPane from "components/common/motion/PendingPane";
import { CallContext } from "context/CallContext";
import { CallOriginator } from "lib/sip";
import { d } from "lib/i18n";
import DTMFAudio from "util/dtmf.js";
import { font } from "styles";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 20px 50px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const PendingAnimation = styled.div`
  width: 100%;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 50px;
`

const CallWaitPane: FC = () => {
  const { t } = useTranslation();
  const { call, hangupCall, answerCall } = useContext(CallContext);

  useEffect(() => {
    const track = isIncoming() ? "ringback" : "dial";
    DTMFAudio.playCustom(track);
    return () => DTMFAudio.stop();
  }, [])

  const isIncoming = (): boolean => {
    return call!.startedBy === CallOriginator.REMOTE;
  }

  return (
    <Container>
      <PendingAnimation>
        <PendingPane label={t(d.ui.loading.calling)} size={font.size.x4l} />
      </PendingAnimation>

      <ControlContainer>
        <HangUpButton active={true} size={65} onClick={hangupCall} />
        {isIncoming() && <CallButton active={true} size={65} onClick={answerCall} />}
      </ControlContainer>
    </Container>
  );
};

export default CallWaitPane;
