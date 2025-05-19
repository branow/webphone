import { FC, MouseEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsFillTrash3Fill } from "react-icons/bs";
import { ImPhone } from "react-icons/im";
import Photo from "../../components/Photo";
import DurationInMs from "../../components/DurationInMs";
import HistoryApi, { Record, CallStatus } from "../../services/history";
import { d } from "../../lib/i18n";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format";
import "./NodeUnrolled.css";

interface Props {
  record: Record;
  rollUp: () => void;
}

const NodeUnrolled: FC<Props> = ({ record, rollUp }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      <button
        className="transparent-btn delete-btn node-delete-btn"
        onClick={handleRemove}
      >
        <BsFillTrash3Fill />
      </button>
      <div className="node-unrolled-content">
        <div className="node-unrolled-photo">
          <Photo photo={contact?.photo} size={60} />
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
              (<span>{t(d.call.status.incoming)}{record.endDate ? <>, {duration()}</> : ""}</span>)
            }
            {
              record.status === CallStatus.OUTCOMING &&
              (<span>{t(d.call.status.outgoing)}{record.endDate ? <>, {duration()}</> : ""}</span>)
            }
            {record.status === CallStatus.MISSED && (<span>{t(d.call.status.missed)}</span>)}
            {record.status === CallStatus.FAILED && (<span>{t(d.call.status.failed)}</span>)}
          </div>
          <div className="node-unrolled-time">
            {record.startDate.toTimeString().substring(0, 5)}
          </div>
        </div>
      </div>
      <div className="node-unrolled-call-btn-con">
        <button
          className="call-btn"
          onClick={handleCall}
        >
          <ImPhone />
        </button>
      </div>
    </div>
  );
};

export default NodeUnrolled;
