import { FC, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import FadeMotion from "../../../components/common/motion/FadeMotion";
import Photo from "../../../components/contact/photo/Photo";
import CallWaitPane from "./CallWaitPane";
import CallActivePane from "./CallActivePane";
import CallEndPane from "./CallEndPane";
import { useTheme } from "../../../hooks/useTheme";
import { CallContext } from "../../../context/CallContext";
import { d } from "../../../lib/i18n";
import { Paths } from "../../../routes";
import { font } from "../../../styles";
import PendingPane from "../../../components/common/motion/PendingPane";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const Number = styled.div<{ color: string }>`
  font-size: ${font.size.xl}px;
  color: ${p => p.color};
`;

const CallActivePageContent: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { call } = useContext(CallContext);

  useEffect(() => {
    if (!call) { navigate(Paths.Dialpad()); }
  }, [call]);

  if (!call) {
    return <PendingPane label={t(d.ui.loading.redirecting)} />
  }

  const th = useTheme();

  return (
    <Container>
      <Top>
        <Photo size={140} />
        <Number color={th.colors.text}>{"123412432"}</Number>
      </Top>
      <AnimatePresence mode="wait">
        {call.state.isOnProgress() && (
          <FadeMotion key="wait">
            <CallWaitPane />
          </FadeMotion>
        )}
        {call.state.isEstablished() && (
          <FadeMotion key="active">
            <CallActivePane />
          </FadeMotion>
        )}
        {call.state.isEnded() && (
          <FadeMotion key="ended">
            <CallEndPane />
          </FadeMotion>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default CallActivePageContent;
