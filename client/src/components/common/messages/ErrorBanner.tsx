import { styled } from "@linaria/react";
import { FC } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { font } from "../../../styles";
import FadeMotion from "../motion/FadeMotion";

const Container = styled.div<{ color: string, size: number }>`
  width: 100%;
  padding: ${p => p.size / 1.5};
  box-sizing: border-box;
  font-size: ${p => p.size}px;
  font-weight: bold;
  text-align: center;
  color: ${p => p.color};
`;

interface Props {
  error: Error | string | undefined | null;
  size?: number;
  className?: string;
}

const ErrorBanner: FC<Props> = ({ error, size, className }) => {
  const th = useTheme();

  const message = error instanceof Error ? error.message : error;

  if (!message) return <></>;

  size = size ?? font.size.m;

  return (
    <FadeMotion key={message} center={true}>
      <Container
        className={className}
        color={th.colors.redHover}
        size={size}
      >
          {message}
      </Container>
    </FadeMotion>
  );
};

export default ErrorBanner;
