import { FC } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const Container = styled.div<{ color: string }>`
  font-size: ${font.size.s}px;
  color: ${p => p.color};
`;

interface Props {
  error: Error | string | undefined | null;
}

const ErrorMessage: FC<Props> = ({ error }) => {
  const th = useTheme();

  const message = error instanceof Error ? error.message : error;

  if (!message) return <></>;

  return <Container color={th.colors.redHover}>{message}</Container>;
};

export default ErrorMessage;
