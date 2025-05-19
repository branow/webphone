import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PendingTab from "../components/PendingTab";
import { SipContext } from "../context/SipContext";
import { d } from "../lib/i18n";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { connection } = useContext(SipContext);

  useEffect(() => {
    if (connection.isConnected()) navigate("/dialpad");
    if (connection.isDisconnected()) navigate("/account");
  }, [navigate, connection]);

  return <PendingTab text={t(d.ui.loading.connecting)} />;
}

export default HomePage;
