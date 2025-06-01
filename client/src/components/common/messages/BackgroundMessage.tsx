import { styled } from "@linaria/react";
import { FC } from "react";
import { font } from "../../../styles";
import { useTheme } from "../../../hooks/useTheme";

const Message = styled.div<{ color: string }>`
  padding: 20px;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
  text-align: center;
`;

interface Props {
  text: string;
}

const BackgroundMessage: FC<Props> = ({ text }) => {
  const th = useTheme();
  return <Message color={th.colors.textDisabled}>{text}</Message>;
}

export default BackgroundMessage;
