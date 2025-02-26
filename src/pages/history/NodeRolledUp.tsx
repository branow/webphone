import { FC } from "react";
import { 
  BsFillTelephoneInboundFill,
  BsFillTelephoneOutboundFill,
  BsFillTelephoneXFill,
  BsBan,
} from "react-icons/bs";
import { Contact } from "../../services/contacts.ts";
import { Node, CallStatus } from "../../services/history.ts";
import { formatPhoneNumber } from "../../util/format.ts";
import "./NodeRolledUp.css";

interface Props {
  node: Node;
  contact?: Contact;
  unroll: (id: string) => void;
}

const NodeRolledUp: FC<Props> = ({ node, unroll, contact }) => {
  return (
    <div className="node-rolled-up" onClick={() => unroll(node.id)}>
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
      {contact && <div>{contact.name}</div>}
      {!contact && <div>{formatPhoneNumber(node.number)}</div>}
      <div className="node-rolled-up-time">
        {node.startDate.toTimeString().substring(0, 5)}
      </div>
    </div>
  );
};


export default NodeRolledUp;
