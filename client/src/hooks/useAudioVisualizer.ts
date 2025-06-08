import { useEffect, useRef } from "react";
import AudioVisualizer from "util/waveform.js";

export interface AudioVisualizerOptions {
  fillStyle: string,
  strokeStyle: string,
  lineWidth: number,
}

export function useAudioVisualizer(audio: MediaStream | undefined, options: AudioVisualizerOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audio && canvasRef.current) {
      AudioVisualizer.init(canvasRef.current, audio, options);
      AudioVisualizer.start();
    }
    return () => AudioVisualizer.stop();
  }, [audio, canvasRef, options]);

  return { canvasRef };
}
