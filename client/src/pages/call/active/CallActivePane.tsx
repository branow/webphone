import { FC, useContext, useState } from "react";
import { styled } from "@linaria/react";
import { BsMicFill, BsMicMuteFill, BsVolumeUpFill, BsVolumeMuteFill, BsFillCameraVideoFill, BsFillCameraVideoOffFill, BsPause, BsPlay } from "react-icons/bs";
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

const Controls = styled.div``;

const TopControls = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const BottomControls = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div<{ color: string }>`
  & > * {
    padding: 15px;
    font-size: ${font.size.xxl}px;
  }

  & > * > * {
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
  const { call, toggleAudio, toggleMicro, toggleCamera, toggleHold, hangupCall } = useContext(CallContext);
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
      <Controls>
        <TopControls color={th.colors.text}>
          <ButtonContainer color={th.colors.text}>
            {call!.audio && (
              <TransparentRoundButton onClick={toggleAudio} disabled={call?.isOnHold}>
                <BsVolumeUpFill/>
              </TransparentRoundButton>
            )}
            {!call!.audio && (
              <TransparentRoundButton onClick={toggleAudio} disabled={call?.isOnHold}>
                <BsVolumeMuteFill/>
              </TransparentRoundButton>
            )}
          </ButtonContainer>
          <ButtonContainer color={th.colors.text}>
            {call!.micro && (
              <TransparentRoundButton onClick={toggleMicro}>
                <BsMicFill />
              </TransparentRoundButton>
            )}
            {!call!.micro && (
              <TransparentRoundButton onClick={toggleMicro}>
                <BsMicMuteFill />
              </TransparentRoundButton>
            )}
          </ButtonContainer>
          <ButtonContainer color={th.colors.text}>
            {call!.video && (
              <TransparentRoundButton onClick={toggleCamera}>
                <BsFillCameraVideoFill />
              </TransparentRoundButton>
            )}
            {!call!.video && (
              <TransparentRoundButton onClick={toggleCamera}>
                <BsFillCameraVideoOffFill />
              </TransparentRoundButton>
            )}
          </ButtonContainer>
        </TopControls>
        <BottomControls color={th.colors.text}>
          <ButtonContainer color={th.colors.text}>
            <TransparentRoundButton
              onClick={() => setShowKeypad(!showKeypad)}
              disabled={call?.isOnHold}
            >
              <IoIosKeypad />
            </TransparentRoundButton>
          </ButtonContainer>
          <HangUpButton size={65} onClick={hangupCall} style={{ padding: "0" }} />
          <ButtonContainer color={th.colors.text}>
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
          </ButtonContainer>
        </BottomControls>
      </Controls>
    </Container>
  );
};

export default CallActivePane;
