import { FC, ReactNode } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "../../../hooks/useTheme";
import { font } from "../../../styles";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.div<{color : string}>`
  text-transform: uppercase;
  text-align: center;
  font-size: ${font.size.m}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const Body = styled.div<{ color: string }>`
  font-size: ${font.size.m}px;
  color: ${p => p.color};
`;

interface Props {
  title?: string;
  children: ReactNode;
}

const Chapter: FC<Props> = ({ title, children }) => {
  const th = useTheme();

  return (
    <Container>
      {title && <Title color={th.colors.iconDark}>{title}</Title>}
      <Body color={th.colors.text}>{children}</Body>
    </Container>
  );
}

export default Chapter;
