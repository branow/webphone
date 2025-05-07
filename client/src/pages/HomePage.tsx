import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import PendingTab from "../components/PendingTab";
import { SipContext } from "../context/SipContext";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { connection } = useContext(SipContext);

  useEffect(() => {
    if (connection.isConnected()) navigate("/dialpad");
    if (connection.isDisconnected()) navigate("/account");
  }, [navigate, connection]);

  return <PendingTab text="CONNECTING" />;
}

export default HomePage;
