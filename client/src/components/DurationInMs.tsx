import { FC } from "react";
import { useTranslation } from "react-i18next";
import { d } from "../lib/i18n";

interface Props {
  date1: Date;
  date2: Date;
}

const DurationInMis: FC<Props> = ({date1, date2}) => {
  const { t } = useTranslation();
  const { minutes, seconds } = calcDurationInMsString(date1, date2);

  const parts = [];
  if (minutes > 0) parts.push(t(d.ui.duration.minutes, { count: minutes }));
  if (seconds > 0 || minutes === 0) parts.push(t(d.ui.duration.seconds, { count: seconds }));

  return (
    <span>
      {parts.join(" ")}
    </span>
  );
};

export default DurationInMis;

function calcDurationInMsString(date1: Date, date2: Date): { minutes: number; seconds: number} {
  const differenceInMs = Math.abs(date2.getTime() - date1.getTime());
  const totalSeconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;    
  return { minutes, seconds }
}
