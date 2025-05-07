import { RefObject, useEffect, useState } from "react";

interface Props {
  audioRef: RefObject<HTMLAudioElement>;
  defaultVolume?: boolean;
}

export function useVolume({ audioRef, defaultVolume }: Props) {
  const [volume, setVolume] = useState<boolean>(defaultVolume ?? true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !volume;
    }
  }, [audioRef, volume])

  const mute = () => setVolume(false);

  const unmute = () => setVolume(true);

  return { volume, mute, unmute }
}
