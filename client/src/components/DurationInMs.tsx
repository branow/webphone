import { FC } from "react";

interface Props {
  date1: Date;
  date2: Date;
}

const DurationInMis: FC<Props> = ({date1, date2}) => {
  const {minutes, seconds} = calcDurationInMsString(date1, date2);
  return (
    <span>
      {minutes} m. {seconds} s.
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
