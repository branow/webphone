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
import Button from "../../components/Button";
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
        {
          volume ?
          (<Button
            className="transparent-btn call-active-pane-control-btn"
            Icon={BsVolumeUpFill}
            onClick={() => setVolume(false)}
          />) :
          (<Button
            className="transparent-btn call-active-pane-control-btn"
            Icon={BsVolumeMuteFill}
            onClick={() => setVolume(true)}
          />)
        }
        {
          call!.isMuted ?
          (<Button
            className="transparent-btn call-active-pane-control-btn"
            Icon={BsMicMuteFill}
            onClick={() => call!.muteMicro(false)}
          />) :
          (<Button
            className="transparent-btn call-active-pane-control-btn"
            Icon={BsMicFill}
            onClick={() => call!.muteMicro(true)}
          />)
        }
        <Button
          className="transparent-btn call-active-pane-control-btn"
          Icon={IoIosKeypad}
          onClick={handleSwitchKeypad}
        />
      </div>
      <Button
        className="hang-up-btn control-btn"
        Icon={ImPhoneHangUp}
        onClick={handleTerminate}
      />
    </div>
  )
}

export default CallActivePane;
