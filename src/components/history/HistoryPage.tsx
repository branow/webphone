import { FC, useState, useEffect, useContext } from "react";
import { BsArrowLeftCircle, BsFillTrash3Fill } from "react-icons/bs";
import { motion as m } from "framer-motion";
import { SipContext, RegistrationState } from "../account/SipProvider";
import HistoryNode from "./HistoryNode";
import { HistoryContext, Node } from "./HistoryProvider";
import { TabContext, Tab } from "../Phone";
import Button from "../Button";
import "./HistoryPage.css";

const HistoryPage: FC = () => {
  const { registrationState } = useContext(SipContext)!;
  const { switchTab } = useContext(TabContext)!;
  const { nodes, clean } = useContext(HistoryContext)!;
  const [selectedNode, setSelectedNode] = useState<Date | null>();

  useEffect(() => {
    if (registrationState !== RegistrationState.REGISTERED) {
      switchTab(Tab.ACCOUNT);
    }
  }, [registrationState]);

  const handleOnUnrolled = (date: Date) => {
    setSelectedNode(date);
  }

  const handleDialPadPage = () => switchTab(Tab.DIALPAD);

  return (
    <m.div
      className="history-page"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: "0", opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.5, easy: "easeOut" }}
    >
      <div className="history-page-header">
        <Button
          className="transparent-btn history-page-dial-page-pad-btn"
          Icon={BsArrowLeftCircle}
          onClick={handleDialPadPage}
        />
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
    </m.div>
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
