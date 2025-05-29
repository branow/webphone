import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import PendingPane from "../../components/common/motion/PendingPane";
import DialPadPageContent from "./DialPadPageContent";
import { SipContext } from "../../context/SipContext";
import { d } from "../../lib/i18n";
import { Paths } from "../../routes";

const DialPadPage: FC = () => {
  const navigate = useNavigate();
  const { connection } = useContext(SipContext);

  useEffect(() => {
    if (!connection.isConnected()) {
      navigate(Paths.Account());
    }
  }, [connection, navigate]);

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {!connection.isConnected() && (
        <PendingPane
          label={t(d.ui.loading.loading)}
          message={t(d.ui.loading.wait)}
        />
      )}
      {connection.isConnected() && <DialPadPageContent />}
    </AnimatePresence>
  );
};

export default DialPadPage;
