import { FC, useState, useContext } from "react";
import { BsArrowLeftCircle, BsFillTrash3Fill } from "react-icons/bs";
import HistoryNode from "./HistoryNode";
import { HistoryContext, Node } from "./HistoryProvider";
import { TabContext, Tab } from "../Phone";
import Button from "../Button";
import "./HistoryPage.css";

const HistoryPage: FC = () => {
  const { switchTab } = useContext(TabContext)!;
  const { nodes, clean } = useContext(HistoryContext)!;
  const [selectedNode, setSelectedNode] = useState<Date | null>();

  const handleOnUnrolled = (date: Date) => {
    setSelectedNode(date);
  }

  const handleDialPadPage = () => switchTab(Tab.DIALPAD);

  return (
    <div>
      <div className="history-page-header">
        <Button Icon={BsArrowLeftCircle} onClick={handleDialPadPage}/>
        <div>History</div>
        <Button Icon={BsFillTrash3Fill} onClick={clean}/>
      </div>
      <div>
        {groupByDate(nodes).map(nodeGroup => (
          <div key={nodeGroup[0].startDate.toDateString()}>
            <div>{nodeGroup[0].startDate.toDateString()}</div>
            <div>
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
    </div>
  );
};

function groupByDate(nodes: Node[]): Node[][] {
  if (nodes.length === 0) return [];
  nodes.sort((n1, n2) => n2.startDate - n1.startDate);
  const grouped: Node[][] = [[]];
  
  const curDate: string = nodes[0].startDate.toDateString();
  grouped[0].push(nodes[0]);
  for (let i = 1, j = 0; i < nodes.length; i++) {
    const nextDate = nodes[i].startDate.toDateString();
    if (curDate === nextDate) {
      grouped[j].push(nodes[i]);
    } else {
      grouped.push([]);
      grouped[++j].push(nodes[i]);
    }
  }
  
  return grouped;
}

export default HistoryPage;
