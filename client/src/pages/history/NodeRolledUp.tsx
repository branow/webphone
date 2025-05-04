import { FC } from "react";
import { 
  BsFillTelephoneInboundFill,
  BsFillTelephoneOutboundFill,
  BsFillTelephoneXFill,
  BsBan,
} from "react-icons/bs";
import { Record, CallStatus } from "../../services/history.ts";
import { formatPhoneNumber } from "../../util/format.ts";
import "./NodeRolledUp.css";

interface Props {
  record: Record;
  unroll: (id: string) => void;
}

const NodeRolledUp: FC<Props> = ({ record, unroll }) => {
  const contact = record.contact;
  return (
    <div className="node-rolled-up" onClick={() => unroll(record.id)}>
      <div>
        {record.status === CallStatus.INCOMING && 
          (<div className="icon-incoming"><BsFillTelephoneInboundFill /></div>)}
        {record.status === CallStatus.OUTCOMING && 
          (<div className="icon-outcoming"><BsFillTelephoneOutboundFill /></div>)}
        {record.status === CallStatus.MISSED && 
          (<div className="icon-missed"><BsFillTelephoneXFill /></div>)}
        {record.status === CallStatus.FAILED && 
          (<div className="icon-failed"><BsBan /></div>)}
      </div>
      {contact && <div>{contact.name}</div>}
      {!contact && <div>{formatPhoneNumber(record.number)}</div>}
      <div className="node-rolled-up-time">
        {record.startDate.toTimeString().substring(0, 5)}
      </div>
    </div>
  );
};


export default NodeRolledUp;
