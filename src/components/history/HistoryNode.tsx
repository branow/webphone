import { FC, useContext } from "react";
import { 
  BsFillTelephoneInboundFill,
  BsFillTelephoneOutboundFill,
  BsFillTelephoneXFill,
  BsBan,
  BsFillTrash3Fill,
} from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import DurationInMs from "./DurationInMs";
import Button from "../Button";
import { HistoryContext, Node, CallStatus } from "./HistoryProvider";
import "./HistoryNode.css";

interface Props {
  node: Node;
  unrolled?: boolean;
  onUnroll: (date: Date) => void;
}

const HistoryNode: FC<Props> = ({ node, unrolled, onUnroll }) => {
  const { removeNode } = useContext(HistoryContext)!;

  const handleRemove = () => removeNode(node);

  return (
    <div className="history-node">
      {
        unrolled ? 
        (
          <div className="history-node-unrolled">
            <div className="history-node-unrolled-header">
              <div>{node.number}</div>
              <Button Icon={BsFillTrash3Fill} onClick={handleRemove} />
            </div>
            <div>
              {node.status === CallStatus.INCOMING && (<span>Incoming, <DurationInMs date1={node.startDate} date2={node.endDate} /></span>)}
              {node.status === CallStatus.OUTCOMING && (<span>Outcoming, <DurationInMs date1={node.startDate} date2={node.endDate} /></span>)}
              {node.status === CallStatus.MISSED && (<span>Missed</span>)}
              {node.status === CallStatus.FAILED && (<span>Failed</span>)}
            </div>
            <div>{node.startDate.toTimeString().substring(0, 5)}</div>
            <Button Icon={FiPhone} />
          </div>
        ) :
        (
          <div className="history-node-rolled-up" onClick={() => onUnroll(node.startDate)}>
            <div>
              {node.status === CallStatus.INCOMING && (<BsFillTelephoneInboundFill />)}
              {node.status === CallStatus.OUTCOMING && (<BsFillTelephoneOutboundFill />)}
              {node.status === CallStatus.MISSED && (<BsFillTelephoneXFill />)}
              {node.status === CallStatus.FAILED && (<BsBan />)}
            </div>
            <div>{node.number}</div>
            <div>{node.startDate.toTimeString().substring(0, 5)}</div>
          </div>
        )
      }
    </div>
  );
};


export default HistoryNode;
