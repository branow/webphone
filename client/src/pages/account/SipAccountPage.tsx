import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import PendingPane from "../../components/common/motion/PendingPane";
import FadeMotion from "../../components/common/motion/FadeMotion";
import SipAccountForm from "./SipAccountForm"
import { SipContext } from "../../context/SipContext";
import { d } from "../../lib/i18n";
import { Paths } from "../../routes";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SipAccountPage: FC = () => {
  const { t } = useTranslation();
  const { connection } = useContext(SipContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (connection.isConnected()) navigate(Paths.Dialpad());
  }, [navigate, connection])

  return (
    <Container>
      <AnimatePresence mode="wait">
        {connection.isConnecting() && <PendingPane label={t(d.ui.loading.connecting)} message={t(d.ui.loading.wait)} />}
        {connection.isConnected() && <PendingPane label={t(d.ui.loading.redirecting)} message={t(d.ui.loading.wait)} />}
        {connection.isDisconnected() && <FadeMotion><SipAccountForm /></FadeMotion>}
      </AnimatePresence>
    </Container>
  );
};

export default SipAccountPage;
