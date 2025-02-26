import { FC } from "react";
import NodeUnrolled from "./NodeUnrolled";
import NodeRolledUp from "./NodeRolledUp";
import { Contact } from "../../services/contacts.ts";
import { Node } from "../../services/history.ts";
import "./HistoryNode.css";

interface Props {
  node: Node;
  contact?: Contact;
  unrolled?: boolean;
  unroll: (id: string) => void;
  rollUp: () => void;
}

const HistoryNode: FC<Props> = ({ node, contact, unrolled, unroll, rollUp }) => {
  return (
    <div className="history-node">
      {
        unrolled ?
        (<NodeUnrolled node={node} contact={contact} rollUp={rollUp} />) :
        (<NodeRolledUp node={node} contact={contact} unroll={unroll} />)
      }
    </div>
  );
};

export default HistoryNode;
