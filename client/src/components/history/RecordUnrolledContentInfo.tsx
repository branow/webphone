import { FC } from "react";
import { Link } from "react-router";
import { styled } from "@linaria/react";
import StatusMessage from "./StatusMessage";
import { useTheme } from "../../hooks/useTheme";
import { Record, Contact } from "../../services/history";
import { formatPhoneNumber } from "../../util/format";
import { font } from "../../styles";
import { Paths } from "../../routes";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: left;
`;

const NameContainer = styled.div<{ color: string }>`
  font-size: ${font.size.m}px;

  & a {
    color: ${p => p.color};
    text-decoration: none;
  }

  &:hover a {
    text-decoration: underline;
  }
`;

const Name: FC<{ contact: Contact }> = ({ contact }) => {
  const th = useTheme();
  return (
    <NameContainer color={th.colors.text}>
      <Link to={Paths.ContactView({ id: contact.id })}>{contact.name}</Link>
    </NameContainer>
  );
};

const NumberContainer = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-size: ${font.size.m}px;
`;

const StatusMessageContainer = styled.div`
  font-size: ${font.size.s}px;
  font-weight: bold;
`;

const TimeContainer = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-size: ${font.size.s}px;
  font-weight: bold;
`

interface Props {
  record: Record;
}

const RecordUnrolledContentInfo: FC<Props> = ({ record }) => {
  const th = useTheme();

  return (
    <Container>
      {record.contact && <Name contact={record.contact} />}
      <NumberContainer color={th.colors.text}>
        {formatPhoneNumber(record.number)}
      </NumberContainer>
      <StatusMessageContainer>
        <StatusMessage record={record} />
      </StatusMessageContainer>
      <TimeContainer color={th.colors.title}>
        {record.startDate.toTimeString().substring(0, 5)}
      </TimeContainer>
    </Container>
  );
};

export default RecordUnrolledContentInfo;
