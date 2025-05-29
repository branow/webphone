import { FC } from "react";
import { useTranslation } from "react-i18next";
import DurationInMs from "../call/DurationInMs";
import { useTheme } from "../../hooks/useTheme";
import { Record, CallStatus } from "../../services/history";
import { d } from "../../lib/i18n";

interface Props {
  record: Record;
}

const StatusMessage: FC<Props> = ({ record }) => {
  const th = useTheme();
  const { t } = useTranslation();

  const duration = () => {
    if (!record.endDate) return <></>
    return <>{" "}<DurationInMs date1={record.startDate} date2={record.endDate!} /></>;
  };

  switch (record.status) {
    case CallStatus.INCOMING:
      return <span style={{ color: th.colors.gray }}>{t(d.call.status.incoming)}{duration()}</span>;
    case CallStatus.OUTGOING:
      return <span style={{ color: th.colors.green }}>{t(d.call.status.outgoing)}{duration()}</span>;
    case CallStatus.MISSED:
      return <span style={{ color: th.colors.red }}>{t(d.call.status.missed)}{duration()}</span>;
    case CallStatus.FAILED:
      return <span style={{ color: th.colors.blue }}>{t(d.call.status.failed)}{duration()}</span>;
  };
};

export default StatusMessage;
