import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { SipContext } from "../context/SipContext";

const SipEventsHandler: FC = () => {
  const navigate = useNavigate();
  const { onIncomingCall } = useContext(SipContext);

  useEffect(() => {
    onIncomingCall(id => navigate(`/call/active/${id}`));
  }, [onIncomingCall]);

  return <></>;
};

export default SipEventsHandler;
