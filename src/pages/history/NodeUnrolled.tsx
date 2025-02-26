import { FC, MouseEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { BsFillTrash3Fill } from "react-icons/bs";
import { ImPhone } from "react-icons/im";
import { queryClient } from "../../lib/query.ts";
import NumberTypeIcon from "../../components/NumberTypeIcon";
import Photo from "../../components/Photo";
import DurationInMs from "../../components/DurationInMs";
import Button from "../../components/Button";
import { Contact } from "../../services/contacts.ts";
import { Node, CallStatus, QueryKeys, remove } from "../../services/history.ts";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format.ts";
import "./NodeUnrolled.css";

interface Props {
  node: Node;
  contact?: Contact;
  rollUp: () => void;
}

const NodeUnrolled: FC<Props> = ({ node, rollUp, contact }) => {
  const navigate = useNavigate();

  const removing = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      navigate("/history");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.history] });
    }
  });

  const handleRemove = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    removing.mutate(node.id);
  }

  const handleCall = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate(`/call/${extractPhoneNumber(node.number)}`);
  }

  return (
    <div
      className="node-unrolled"
      onClick={rollUp}
    >
      <Button
        className="transparent-btn delete-btn node-delete-btn"
        Icon={BsFillTrash3Fill}
        onClick={handleRemove}
      />
      <div className="node-unrolled-content">
        <div className="node-unrolled-photo">
          <Photo src={contact ? contact.photo : ""} size="60px"/>
        </div>
        <div className="node-unrolled-info">
          {contact && (
            <Link className="node-unrolled-name" to={`/contacts/${contact.id}`}>
              {contact.name}
            </Link>
          )}
          <div className="node-unrolled-number">
            {contact && (
              <NumberTypeIcon
                type={contact.numbers
                  .find(number => number.number === node.number)!.type}
              />
            )} 
            <div>{formatPhoneNumber(node.number)}</div>
          </div>
          <div className="node-unrolled-status">
            {node.status === CallStatus.INCOMING && 
              (<span>Incoming,{" "}
                <DurationInMs date1={node.startDate} date2={node.endDate!} />
              </span>)}
            {node.status === CallStatus.OUTCOMING && 
              (<span>Outcoming,{" "}
                <DurationInMs date1={node.startDate} date2={node.endDate!} />
              </span>)}
            {node.status === CallStatus.MISSED && (<span>Missed</span>)}
            {node.status === CallStatus.FAILED && (<span>Failed</span>)}
          </div>
          <div className="node-unrolled-time">
            {node.startDate.toTimeString().substring(0, 5)}
          </div>
        </div>
      </div>
      <div className="node-unrolled-call-btn-con">
        <Button
          className="call-btn"
          Icon={ImPhone}
          onClick={handleCall}
        />
      </div>
    </div>
  );
};

export default NodeUnrolled;
