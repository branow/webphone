import { useEffect, useRef } from "react";
import AudioVisualizer from "util/waveform.js";

export interface AudioVisualizerOptions {
  fillStyle: string,
  strokeStyle: string,
  lineWidth: number,
}

export function useAudioVisualizer(stream: MediaStream | undefined, options: AudioVisualizerOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (stream && stream.getAudioTracks().length > 0 && canvasRef.current) {
      AudioVisualizer.init(canvasRef.current, stream.clone(), options);
      AudioVisualizer.start();
    }
    return () => AudioVisualizer.stop();
  }, [stream, canvasRef, options]);

  return { canvasRef };
}
