import { useEffect, useState } from "react";

export function useIsActiveVideo(stream: MediaStream, checkInterval = 500) {
  const [isVideoActive, setIsVideoActive] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.playsInline = true;
    video.autoplay = true;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const check = () => setIsVideoActive(isActiveVideo(video, canvas, ctx!));
    const interval = window.setInterval(check, checkInterval);

    return () => {
      clearInterval(interval);
      video.srcObject = null;
    };
  }, [stream, checkInterval]);

  return isVideoActive;
}

function isActiveVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): boolean {
  if (!video.videoWidth || !video.videoHeight || !ctx) return false;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  return !frame.every((v, i) => i % 4 === 3 || v < 5);
}
