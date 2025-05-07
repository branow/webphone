import { useEffect, useRef } from "react";

export function useAudio(stream?: MediaStream) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (stream && audioRef.current && !audioRef.current.srcObject) {
      audioRef.current.srcObject = stream;
    }
  }, [stream, audioRef]);

  return { audioRef: audioRef };
}
