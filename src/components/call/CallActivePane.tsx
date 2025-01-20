import { FC, useContext, useState, useEffect, useRef } from "react";
import {
  BsMicFill,
  BsMicMuteFill,
  BsVolumeUpFill,
  BsVolumeMuteFill
} from "react-icons/bs";
import { IoIosKeypad } from "react-icons/io";
import { ImPhoneHangUp } from "react-icons/im";
import { CallContext } from "./CallProvider";
import KeypadPane from "./KeypadPane";
import Button from "../Button";
import AudioVisualizer from "../../util/waveform.js";

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
      AudioVisualizer.init(canvas, audio);
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
      <div>
        <canvas ref={canvasRef} />
      </div>
      {showKeypad && (<KeypadPane />)}
      <div className="call-active-pane-controls">
        <div>
          {
            volume ?
            (<Button Icon={BsVolumeUpFill} onClick={() => setVolume(false)} />) :
            (<Button Icon={BsVolumeMuteFill} onClick={() => setVolume(true)} />)
          }
        </div>
        <div>
          {
            call!.isMuted ?
            (<Button Icon={BsMicMuteFill} onClick={() => call!.muteMicro(false)} />) :
            (<Button Icon={BsMicFill} onClick={() => call!.muteMicro(true)} />)
          }
        </div>
        <div>
          <Button Icon={IoIosKeypad} onClick={handleSwitchKeypad}/>
        </div>
      </div>
      <Button Icon={ImPhoneHangUp} onClick={handleTerminate} />
    </div>
  )
}

export default CallActivePane;
