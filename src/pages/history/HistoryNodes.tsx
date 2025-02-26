import { FC, useState } from "react";
import HistoryNode from "./HistoryNode";
import { Node } from "../../services/history.ts";
import { Contact } from "../../services/contacts.ts";
import "./HistoryNodes.css";

interface Props {
  nodes: Node[];
  contacts: Contact[];
}

const HistoryNodes: FC<Props> = ({ nodes, contacts }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>();

  return (
    <div className="history-nodes">
      {groupByDate(nodes).map(nodeGroup => (
        <div key={nodeGroup[0].startDate.toDateString()}>
          <div className="history-nodes-date">
            {nodeGroup[0].startDate.toDateString()}
          </div>
          <div className="history-nodes-of-date">
            {nodeGroup.map(node => {
              const contact = findContact(node, contacts);
              return (
                <HistoryNode
                  key={node.id}
                  unrolled={node.id === selectedNodeId}
                  node={node}
                  contact={contact}
                  unroll={() => setSelectedNodeId(node.id)}
                  rollUp={() => setSelectedNodeId(null)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

function groupByDate(nodes: Node[]): Node[][] {
  if (nodes.length === 0) return [];
  nodes.sort((n1, n2) => n2.startDate.getTime() - n1.startDate.getTime());
  const grouped: Node[][] = [[]];
  
  let curDate: string = nodes[0].startDate.toDateString();
  grouped[0].push(nodes[0]);
  for (let i = 1, j = 0; i < nodes.length; i++) {
    const nextDate = nodes[i].startDate.toDateString();
    if (curDate === nextDate) {
      grouped[j].push(nodes[i]);
    } else {
      grouped.push([]);
      grouped[++j].push(nodes[i]);
      curDate = nextDate;
    }
  }
  
  return grouped;
}

function findContact(node: Node, contacts: Contact[]): Contact | undefined {
  return contacts.find(contact => contact.numbers.find(number => number.number === node.number))
}

export default HistoryNodes;
