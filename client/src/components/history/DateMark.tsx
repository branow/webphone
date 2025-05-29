import { FC } from "react";
import { styled } from "@linaria/react";
import i18n from "../../lib/i18n";
import { font } from "../../styles";
import { useTheme } from "../../hooks/useTheme";

const DateMarkContainer = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-size: ${font.size.s}px;
  padding-top: 15px;
  font-weight: bold;
`;

const DateMark: FC<{ date: Date }> = ({ date }) => {
  const th = useTheme();

  return (
    <DateMarkContainer color={th.colors.subtitle}>
      {new Intl.DateTimeFormat(i18n.language, {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }).format(date)}
    </DateMarkContainer>
  );
};

export default DateMark;
