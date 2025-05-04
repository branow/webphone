import { FC } from "react";
import NodeUnrolled from "./NodeUnrolled";
import NodeRolledUp from "./NodeRolledUp";
import { Record } from "../../services/history.ts";
import "./HistoryNode.css";

interface Props {
  record: Record;
  unrolled?: boolean;
  unroll: (id: string) => void;
  rollUp: () => void;
}

const HistoryNode: FC<Props> = ({ record, unrolled, unroll, rollUp }) => {
  return (
    <div className="history-node">
      {
        unrolled ?
        (<NodeUnrolled record={record} rollUp={rollUp} />) :
        (<NodeRolledUp record={record} unroll={unroll} />)
      }
    </div>
  );
};

export default HistoryNode;
