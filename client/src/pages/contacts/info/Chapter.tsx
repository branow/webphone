import { FC, ReactNode } from "react";
import "./Chapter.css";

interface Props {
  title?: string;
  children: ReactNode;
}

const Chapter: FC<Props> = ({ title, children }) => {
  return (
    <div className="chapter">
      {title && <div className="chapter-title">{title}</div>}
      <div className="chapter-body">{children}</div>
    </div>
  );
}

export default Chapter;
