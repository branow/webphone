import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PendingTab from "../../components/PendingTab";
import SipAccountForm from "./SipAccountForm"
import { SipContext } from "../../context/SipContext";
import { d } from "../../lib/i18n";
import "./SipAccountPage.css";

const SipAccountPage: FC = () => {
  const { t } = useTranslation();
  const { connection } = useContext(SipContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (connection.isConnected()) navigate("/dialpad");
  }, [navigate, connection])

  return (
    <div className="sip-account-page">
      {connection.isConnecting() && <PendingTab text={t(d.ui.loading.connecting)} message={t(d.ui.loading.wait)} />}
      {connection.isConnected() && (<div>{t(d.account.messages.success)}</div>)}
      {connection.isDisconnected() && (<SipAccountForm />)}
    </div>
  );
};

export default SipAccountPage;
