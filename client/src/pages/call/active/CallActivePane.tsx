import { FC, useContext, useState } from "react";
import { styled } from "@linaria/react";
import { BsMicFill, BsMicMuteFill, BsVolumeUpFill, BsVolumeMuteFill, BsPause, BsPlay } from "react-icons/bs";
import { IoIosKeypad } from "react-icons/io";
import TransparentRoundButton from "components/common/button/TransparentRoundButton";
import HangUpButton from "components/call/HangUpButton";
import KeypadPane from "pages/call/active/KeypadPane";
import { useAudioVisualizer } from "hooks/useAudioVisualizer";
import { useTheme } from "hooks/useTheme";
import { CallContext } from "context/CallContext";
import { font } from "styles";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const CallControlPane = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  & > * {
    padding: 15px;
    font-size: ${font.size.xxl}px;
  }

  & svg {
    color: ${p => p.color};
  }
`;

const KeypadContainer = styled.div`
  z-index: 50;
  position: absolute;
  top: 0;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 10%;
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const audioVisualizerOptions = {
  fillStyle: "#0000",
  strokeStyle: "#22c65b",
  lineWidth: 3,
}

const CallActivePane: FC = () => {
  const { call, toggleAudio, toggleMute, toggleHold, hangupCall } = useContext(CallContext);
  const { canvasRef } = useAudioVisualizer(call!.remoteStream, audioVisualizerOptions);
  const [showKeypad, setShowKeypad] = useState(false);

  const th = useTheme();

  return (
    <Container>
      <canvas ref={canvasRef} width="300" height="125" />
      {showKeypad && (
        <KeypadContainer>
          <KeypadPane />
        </KeypadContainer>
      )}
      <CallControlPane color={th.colors.text}>
        {call!.volume && (
          <TransparentRoundButton onClick={toggleAudio} disabled={call?.isOnHold}>
            <BsVolumeUpFill/>
          </TransparentRoundButton>
        )}
        {!call!.volume && (
          <TransparentRoundButton onClick={toggleAudio} disabled={call?.isOnHold}>
            <BsVolumeMuteFill/>
          </TransparentRoundButton>
        )}
        {call!.isMuted && (
          <TransparentRoundButton onClick={toggleMute} disabled={call?.isOnHold}>
            <BsMicMuteFill />
          </TransparentRoundButton>
        )}
        {!call!.isMuted && (
          <TransparentRoundButton onClick={toggleMute} disabled={call?.isOnHold}>
            <BsMicFill />
          </TransparentRoundButton>
        )}
        <TransparentRoundButton
          onClick={() => setShowKeypad(!showKeypad)}
          disabled={call?.isOnHold}
        >
          <IoIosKeypad />
        </TransparentRoundButton>
        {call!.isOnHold && (
          <TransparentRoundButton onClick={toggleHold}>
            <BsPlay />
          </TransparentRoundButton>
        )}
        {!call!.isOnHold && (
          <TransparentRoundButton onClick={toggleHold}>
            <BsPause />
          </TransparentRoundButton>
        )}
      </CallControlPane>
      <HangUpButton size={65} onClick={hangupCall} />
    </Container>
  );
};

export default CallActivePane;
