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
import Button from "../Button";

const CallActivePane: FC = () => {
  const { call } = useContext(CallContext)!;
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current as HTMLAudioElement;
      audio.autoplay = true;
    }
  }, [audioRef])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current as HTMLAudioElement;
      audio.muted = !volume;
    }
  }, [volume])

  useEffect(() => {
    if (call!.stream && audioRef.current) {
      const audio = audioRef.current as HTMLAudioElement;
      audio.srcObject = call!.stream;
    }
  }, [call!.stream])

  const handleTerminate = () => call!.terminate();

  return (
    <div className="call-active-pane">
      <audio ref={audioRef} />
      <div>Waves...</div>
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
          <Button Icon={IoIosKeypad}/>
        </div>
      </div>
      <Button Icon={ImPhoneHangUp} onClick={handleTerminate} />
    </div>
  )
}

export default CallActivePane;
