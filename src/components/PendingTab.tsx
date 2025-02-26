import { FC } from "react";
import "./PendingTab.css";

interface Props {
  text: string;
  message?: string;
}

const PendingTab: FC<Props> = ({ text, message }) => {
  return (
    <div className="pending-tab">
      <div className="pending">{text}</div>
      {message && <div className="pending-message">{message}</div>}
    </div>
  );
}

export default PendingTab;
