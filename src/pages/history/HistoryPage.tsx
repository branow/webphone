import { FC, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { BsFillTrash3Fill } from "react-icons/bs";
import { SipContext, RegistrationState } from "../../providers/SipProvider";
import { HistoryContext, Node } from "../../providers/HistoryProvider";
import HistoryNode from "./HistoryNode";
import NavTabs, { Tab } from "../../components/NavTabs";
import Button from "../../components/Button";
import "./HistoryPage.css";

const HistoryPage: FC = () => {
  const navigate = useNavigate();
  const { registrationState } = useContext(SipContext)!;
  const { nodes, clean } = useContext(HistoryContext)!;
  const [selectedNode, setSelectedNode] = useState<Date | null>();

  useEffect(() => {
    if (registrationState !== RegistrationState.REGISTERED) {
      navigate("/account");
    }
  }, [registrationState]);

  const handleOnUnrolled = (date: Date) => {
    setSelectedNode(date);
  }

  return (
    <div className="history-page">
      <div className="history-page-header">
        <div className="history-page-title">HISTORY</div>
        <Button
          className="transparent-btn delete-btn history-page-delete-btn"
          Icon={BsFillTrash3Fill}
          onClick={clean}
        />
      </div>
      <div className="history-page-nodes">
        {groupByDate(nodes).map(nodeGroup => (
          <div key={nodeGroup[0].startDate.toDateString()}>
            <div className="history-page-nodes-date">
              {nodeGroup[0].startDate.toDateString()}
            </div>
            <div className="history-page-nodes-of-date">
              {nodeGroup.map(node => (
                <HistoryNode
                  key={node.startDate.getTime()}
                  unrolled={node.startDate === selectedNode}
                  node={node}
                  onUnroll={handleOnUnrolled}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <NavTabs tabs={[Tab.CONTACTS, Tab.DIALPAD]} />
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

export default HistoryPage;
