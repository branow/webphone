import { FC, MouseEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsFillTrash3Fill } from "react-icons/bs";
import { ImPhone } from "react-icons/im";
import Photo from "../../components/Photo";
import DurationInMs from "../../components/DurationInMs";
import Button from "../../components/Button";
import HistoryApi, { Record, CallStatus } from "../../services/history.ts";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format.ts";
import "./NodeUnrolled.css";

interface Props {
  record: Record;
  rollUp: () => void;
}

const NodeUnrolled: FC<Props> = ({ record, rollUp }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const removing = useMutation({
    mutationFn: HistoryApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: HistoryApi.QueryKeys.predicate });
    }
  });

  const handleRemove = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    removing.mutate(record.id);
  }

  const handleCall = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate(`/call/${extractPhoneNumber(record.number)}`);
  }

  const contact = record.contact;

  const duration = () => {
    return (<DurationInMs date1={record.startDate} date2={record.endDate!} />);
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
          <Photo photo={contact?.photo} size="60px"/>
        </div>
        <div className="node-unrolled-info">
          {contact && (
            <Link className="node-unrolled-name" to={`/contacts/${contact.id}`}>
              {contact.name}
            </Link>
          )}
          <div className="node-unrolled-number">
            <div>{formatPhoneNumber(record.number)}</div>
          </div>
          <div className="node-unrolled-status">
            {
              record.status === CallStatus.INCOMING &&
              (<span>Incoming{record.endDate ? <>, {duration()}</> : ""}</span>)
            }
            {
              record.status === CallStatus.OUTCOMING &&
              (<span>Outcoming{record.endDate ? <>, {duration()}</> : ""}</span>)
            }
            {record.status === CallStatus.MISSED && (<span>Missed</span>)}
            {record.status === CallStatus.FAILED && (<span>Failed</span>)}
          </div>
          <div className="node-unrolled-time">
            {record.startDate.toTimeString().substring(0, 5)}
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
