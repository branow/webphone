import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BsMicFill, BsMicMuteFill, BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";
import { IoIosKeypad } from "react-icons/io";
import { ImPhoneHangUp } from "react-icons/im";
import ErrorMessage from "../../components/ErrorMessage";
import { CallContext } from "../../context/CallContext";
import KeypadPane from "./KeypadPane";
import { useAudioVisualizer } from "../../hooks/useAudioVisualizer";
import { useAudio } from "../../hooks/useAudio";
import { useVolume } from "../../hooks/useVolume";
import { d } from "../../lib/i18n";
import "./CallActivePane.css";

const audioVisualizerOptions = {
  fillStyle: "#fff",
  strokeStyle: "#22c65b",
  lineWidth: 3,
}

const CallActivePane: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { call, toggleMute, hangupCall } = useContext(CallContext);
  const { audioRef } = useAudio(call!.remoteStream);
  const { volume, mute, unmute } = useVolume({ audioRef });
  const { canvasRef } = useAudioVisualizer(call!.remoteStream, audioVisualizerOptions);
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    if (!call) navigate("/home");
  }, [call])

  if (!call) {
    return <ErrorMessage error={t(d.call.errors.unexpected)} />
  }

  return (
    <div className="call-active-pane">
      <audio ref={audioRef} autoPlay={true} />
      <canvas ref={canvasRef} width="300" height="125" />
      {showKeypad &&
        (<div className="call-active-pane-keypad-outer-con">
          <div className="call-active-pane-keypad-inner-con">
            <KeypadPane />
          </div>
        </div>)}
      <div className="call-active-pane-controls">
        {volume && (
          <button
            className="transparent-btn call-active-pane-control-btn"
            onClick={mute}
          >
            <BsVolumeUpFill/>
          </button>
        )}
        {!volume && (
          <button
            className="transparent-btn call-active-pane-control-btn"
            onClick={unmute}
          >
            <BsVolumeMuteFill/>
          </button>
        )}
        {call.isMuted && (
          <button
            className="transparent-btn call-active-pane-control-btn"
            onClick={toggleMute}
          >
            <BsMicMuteFill />
          </button>
        )}
        {!call.isMuted && (
          <button
            className="transparent-btn call-active-pane-control-btn"
            onClick={toggleMute}
          >
            <BsMicFill />
          </button>
        )}
        <button
          className="transparent-btn call-active-pane-control-btn"
          onClick={() => setShowKeypad(!showKeypad)}
        >
          <IoIosKeypad />
        </button>
      </div>
      <button
        className="hang-up-btn control-btn"
        onClick={() => hangupCall()}
      >
        <ImPhoneHangUp />
      </button>
    </div>
  )
}

export default CallActivePane;
