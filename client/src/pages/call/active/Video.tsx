import { FC, useEffect, useRef } from "react";
import { styled } from "@linaria/react";

const VideoContainer = styled.div<{ size: number }>`
  width: ${p => p.size}px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

interface Props {
  stream: MediaStream;
  size?: number;
  disabled?: boolean;
}

const Video: FC<Props> = ({ stream, size }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && stream && !video.srcObject) {
      video.srcObject = stream;
    }
  }, [stream]);

  return (
    <VideoContainer size={size || 100}>
      <VideoPlayer ref={videoRef} autoPlay playsInline />
    </VideoContainer>
  );
};

export default Video;
