import { FC } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const Container = styled.div<{ color: string }>`
  font-size: ${font.size.m}px;
  color: ${p => p.color};
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Key = styled.div<{ color: string }>`
  text-transform: uppercase;
  font-weight: bold;
  font-size: ${font.size.s - 2}px;
  color: ${p => p.color};
`;

const Value = styled.div``;

interface Props {
  title: string;
  text: string;
}

const Paragraph: FC<Props> = ({ title, text }) => {
  const th = useTheme();

  return (
    <Container color={th.colors.text}>
      <Key color={th.colors.subtitle}>{title}</Key>
      <Value>{text}</Value>
    </Container>
  );
};

export default Paragraph;
