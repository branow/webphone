import { FC, useContext } from "react";
import { BsMicFill, BsMicMuteFill, BsPause, BsPlay, BsVolumeMuteFill, BsVolumeUpFill } from "react-icons/bs";
import { styled } from "@linaria/react";
import TransparentRoundButton from "components/common/button/TransparentRoundButton";
import HangUpButton from "components/call/HangUpButton";
import { useTheme } from "hooks/useTheme";
import { CallContext } from "context/CallContext";
import DTMFAudio from "util/dtmf.js";
import { font } from "styles";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  & > * {
    padding: 7.5px;
    font-size: ${font.size.xl}px;
  }
`;

const CallPreviewControls: FC = () => {
  const { call, toggleAudio, toggleMicro, toggleHold, hangupCall } = useContext(CallContext);

  const hangupCallWithSound = () => {
    DTMFAudio.playCustom("howler");
    setTimeout(() => {
      DTMFAudio.stop();
    }, 1000);

    hangupCall();
  }

  const th = useTheme();

  return (
    <Container
      onClick={e => e.stopPropagation()}
    >
      {call!.audio && (
        <TransparentRoundButton
          onClick={toggleAudio}
          disabled={call?.isOnHold}
          color={th.colors.text}
          colorHover={th.colors.text}
        >
          <BsVolumeUpFill/>
        </TransparentRoundButton>
      )}
      {!call!.audio && (
        <TransparentRoundButton
          onClick={toggleAudio}
          disabled={call?.isOnHold}
          color={th.colors.text}
          colorHover={th.colors.text}
        >
          <BsVolumeMuteFill/>
        </TransparentRoundButton>
      )}
      {call!.micro && (
        <TransparentRoundButton
          onClick={toggleMicro}
          disabled={call?.isOnHold}
          color={th.colors.text}
          colorHover={th.colors.text}
        >
          <BsMicFill />
        </TransparentRoundButton>
      )}
      {!call!.micro && (
        <TransparentRoundButton
          onClick={toggleMicro}
          disabled={call?.isOnHold}
          color={th.colors.text}
          colorHover={th.colors.text}
        >
          <BsMicMuteFill />
        </TransparentRoundButton>
      )}
      {call!.isOnHold && (
        <TransparentRoundButton
          onClick={toggleHold}
          color={th.colors.text}
          colorHover={th.colors.text}
        >
          <BsPlay />
        </TransparentRoundButton>
      )}
      {!call!.isOnHold && (
        <TransparentRoundButton
          onClick={toggleHold}
          color={th.colors.text}
          colorHover={th.colors.text}
        >
          <BsPause />
        </TransparentRoundButton>
      )}
      <HangUpButton size={40} onClick={hangupCallWithSound} />
    </Container>
  );
}

export default CallPreviewControls;
