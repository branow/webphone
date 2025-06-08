import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { SipContext } from "context/SipContext";
import { Paths } from "routes";

const SipEventsHandler: FC = () => {
  const navigate = useNavigate();
  const { onIncomingCall } = useContext(SipContext);

  useEffect(() => {
    onIncomingCall(id => navigate(Paths.CallActive({ id: id })));
  }, [onIncomingCall]);

  return <></>;
};

export default SipEventsHandler;
