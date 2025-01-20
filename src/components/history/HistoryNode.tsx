import { FC, useContext } from "react";
import { 
  BsFillTelephoneInboundFill,
  BsFillTelephoneOutboundFill,
  BsFillTelephoneXFill,
  BsBan,
  BsFillTrash3Fill,
} from "react-icons/bs";
import { ImPhone } from "react-icons/im";
import DurationInMs from "./DurationInMs";
import Button from "../Button";
import { TabContext, Tab } from "../Phone";
import { HistoryContext, Node, CallStatus } from "./HistoryProvider";
import { CallContext } from "../call/CallProvider";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format.ts";
import "./HistoryNode.css";

interface Props {
  node: Node;
  unrolled?: boolean;
  onUnroll: (date: Date) => void;
}

const HistoryNode: FC<Props> = ({ node, unrolled, onUnroll }) => {
  const { switchTab } = useContext(TabContext)!;
  const { removeNode } = useContext(HistoryContext)!;
  const { doCall } = useContext(CallContext)!;

  const handleRemove = () => removeNode(node);

  const handleCall = () => {
    switchTab(Tab.CALL);
    doCall(extractPhoneNumber(node.number));
  }

  return (
    <div className="history-node">
      {
        unrolled ? 
        (
          <div className="history-node-unrolled">
            <div className="history-node-unrolled-header">
              <div>{node.number}</div>
              <Button
                className="transparent-btn delete-btn history-node-delete-btn"
                Icon={BsFillTrash3Fill}
                onClick={handleRemove}
              />
            </div>
            <div className="history-node-unrolled-status">
              {node.status === CallStatus.INCOMING && 
                (<span>Incoming,{' '}
                  <DurationInMs date1={node.startDate} date2={node.endDate!} />
                </span>)}
              {node.status === CallStatus.OUTCOMING && 
                (<span>Outcoming,{' '}
                  <DurationInMs date1={node.startDate} date2={node.endDate!} />
                </span>)}
              {node.status === CallStatus.MISSED && (<span>Missed</span>)}
              {node.status === CallStatus.FAILED && (<span>Failed</span>)}
            </div>
            <div className="history-node-unrolled-time">
              {node.startDate.toTimeString().substring(0, 5)}
            </div>
            <div className="history-node-unrolled-call-btn-con">
              <Button
                className="call-btn"
                Icon={ImPhone}
                onClick={handleCall}
              />
            </div>
          </div>
        ) :
        (
          <div className="history-node-rolled-up" onClick={() => onUnroll(node.startDate)}>
            <div>
              {node.status === CallStatus.INCOMING && 
                (<div className="icon-incoming"><BsFillTelephoneInboundFill /></div>)}
              {node.status === CallStatus.OUTCOMING && 
                (<div className="icon-outcoming"><BsFillTelephoneOutboundFill /></div>)}
              {node.status === CallStatus.MISSED && 
                (<div className="icon-missed"><BsFillTelephoneXFill /></div>)}
              {node.status === CallStatus.FAILED && 
                (<div className="icon-failed"><BsBan /></div>)}
            </div>
            <div>{formatPhoneNumber(node.number)}</div>
            <div className="history-node-rolled-up-time">
              {node.startDate.toTimeString().substring(0, 5)}
            </div>
          </div>
        )
      }
    </div>
  );
};


export default HistoryNode;
