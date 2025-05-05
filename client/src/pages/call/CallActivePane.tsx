import { FC, useContext, useState, useEffect, useRef } from "react";
import {
  BsMicFill,
  BsMicMuteFill,
  BsVolumeUpFill,
  BsVolumeMuteFill
} from "react-icons/bs";
import { IoIosKeypad } from "react-icons/io";
import { ImPhoneHangUp } from "react-icons/im";
import { CallContext } from "../../providers/CallProvider";
import KeypadPane from "./KeypadPane";
import AudioVisualizer from "../../util/waveform.js";
import "./CallActivePane.css";

const audioVisualizerOptions = {
  fillStyle: "#fff",
  strokeStyle: "#22c65b",
  lineWidth: 3,
}

const CallActivePane: FC = () => {
  const { call } = useContext(CallContext)!;
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [volume, setVolume] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    if (call!.stream && audioRef.current && canvasRef.current) {
      const audio = audioRef.current as HTMLAudioElement;
      audio.autoplay = true;
      audio.srcObject = call!.stream;
      const canvas = canvasRef.current as HTMLCanvasElement;
      AudioVisualizer.init(canvas, audio, audioVisualizerOptions);
      AudioVisualizer.start();
      return () => AudioVisualizer.stop();
    }
  }, [call!.stream, audioRef, canvasRef])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current as HTMLAudioElement;
      audio.muted = !volume;
    }
  }, [audioRef, volume])

  const handleTerminate = () => call!.terminate();

  const handleSwitchKeypad = () => setShowKeypad(!showKeypad);

  return (
    <div className="call-active-pane">
      <audio ref={audioRef} />
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
            onClick={() => setVolume(false)}
          >
            <BsVolumeUpFill/>
          </button>
        )}
        {!volume && (
          <button
            className="transparent-btn call-active-pane-control-btn"
            onClick={() => setVolume(true)}
          >
            <BsVolumeMuteFill/>
          </button>
        )}
        {call!.isMuted && (
          <button
            className="transparent-btn call-active-pane-control-btn"
            onClick={() => call!.muteMicro(false)}
          >
            <BsMicMuteFill />
          </button>
        )}
        {!call!.isMuted && (
          <button
            className="transparent-btn call-active-pane-control-btn"
            onClick={() => call!.muteMicro(true)}
          >
            <BsMicFill />
          </button>
        )}
        <button
          className="transparent-btn call-active-pane-control-btn"
          onClick={handleSwitchKeypad}
        >
          <IoIosKeypad />
        </button>
      </div>
      <button
        className="hang-up-btn control-btn"
        onClick={handleTerminate}
      >
        <ImPhoneHangUp />
      </button>
    </div>
  )
}

export default CallActivePane;
