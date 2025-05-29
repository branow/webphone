import { FC } from "react";
import { styled } from "@linaria/react";
import StatusIcon from "./StatusIcon";
import { useTheme } from "../../hooks/useTheme";
import { Record } from "../../services/history";
import { formatPhoneNumber } from "../../util/format";
import { font } from "../../styles";

const RecordContainer = styled.div`
  cursor: pointer;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-size: ${font.size.m}px;
`;

const Time = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-size: ${font.size.s}px;
  font-weight: bold;
`;

interface Props {
  record: Record;
}

const RecordRolledUp: FC<Props> = ({ record }) => {
  const th = useTheme();

  return (
    <RecordContainer>
      <StatusIcon status={record.status} />
      <Name color={th.colors.text}>
        {record.contact ? record.contact.name : formatPhoneNumber(record.number)}
      </Name>
      <Time color={th.colors.title}>{record.startDate.toTimeString().substring(0, 5)}</Time>
    </RecordContainer>
  );
};

export default RecordRolledUp;
