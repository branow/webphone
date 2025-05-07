import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import PendingTab from "../../components/PendingTab";
import SipAccountForm from "./SipAccountForm"
import { SipContext } from "../../context/SipContext";
import "./SipAccountPage.css";

const SipAccountPage: FC = () => {
  const { connection } = useContext(SipContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (connection.isConnected()) navigate("/dialpad");
  }, [navigate, connection])

  return (
    <div className="sip-account-page">
      {connection.isConnecting() && <PendingTab text="CONNECTING" message="Please wait" />}
      {connection.isConnected() && (<div>You connected successfully!</div>)}
      {connection.isDisconnected() && (<SipAccountForm />)}
    </div>
  );
};

export default SipAccountPage;
