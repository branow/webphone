import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import CallRecord from "components/history/CallRecord";
import DateMark from "components/history/DateMark";
import { useTheme } from "hooks/useTheme";
import { Record } from "services/history";
import { d } from "lib/i18n";
import { font } from "styles";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const NoHistoryMessage = styled.div<{ color: string }>`
  padding: 20px;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
  text-align: center;
`;

interface CallRecordContainerProps {
  record: Record;
  prev?: Record;
  selected?: string;
  setSelected: (id: string | undefined) => void;
}

const CallRecordContainer: FC<CallRecordContainerProps> = ({ record, prev, selected, setSelected }) => {
  const isNewDate = !prev || record.startDate.getDate() !== prev.startDate.getDate();
  return (
    <div key={record.id}>
      {isNewDate && <DateMark date={record.startDate} />}
      <CallRecord
        unrolled={record.id === selected}
        record={record}
        unroll={() => setSelected(record.id)}
        rollUp={() => setSelected(undefined)}
      />
    </div>
  )
};

interface Props {
  records: Record[];
}

const CallRecords: FC<Props> = ({ records }) => {
  const th = useTheme();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>();

  return (
    <Container>
      {records && records.map((r, i) =>
        <CallRecordContainer
          key={r.id}
          record={r}
          prev={i !== 0 ? records[i - 1] : undefined}
          selected={selected}
          setSelected={setSelected}
        />
      )}
      {records.length === 0 && (
        <NoHistoryMessage color={th.colors.textDisabled}>
          {t(d.history.messages.noHistory)}
        </NoHistoryMessage>
      )}
    </Container>
  );
};

export default CallRecords;
