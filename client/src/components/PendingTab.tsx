import { FC } from "react";
import "./PendingTab.css";

interface Props {
  text: string;
  message?: string;
  size?: number;
}

const PendingTab: FC<Props> = ({ text, message, size }) => {
  const lblSize = size || 32;
  const msgSize = Math.ceil(lblSize / 1.8);
  return (
    <div className="pending-tab">
      <div className="pending" style={{ fontSize: lblSize }}>{text}</div>
      {message && <div className="pending-message" style={{ fontSize: msgSize }} >{message}</div>}
    </div>
  );
}

export default PendingTab;
