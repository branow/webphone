import { FC, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import FadeMotion from "components/common/motion/FadeMotion";
import Photo from "components/contact/photo/Photo";
import NotFoundPage from "pages/errors/NotFoundPage";
import CallWaitPane from "pages/call/active/CallWaitPane";
import CallActivePane from "pages/call/active/CallActivePane";
import CallEndPane from "pages/call/active/CallEndPane";
import { useTheme } from "hooks/useTheme";
import { useFetchContactByNumber } from "hooks/fetch";
import { AccountContext } from "context/AccountContext";
import { CallContext } from "context/CallContext";
import { extractPhoneNumber, formatPhoneNumber } from "util/format";
import { font } from "styles";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
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

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div<{ color: string }>`
  font-size: ${font.size.xl}px;
  color: ${p => p.color};
`;

const Subtitle = styled.div<{ color: string }>`
  font-size: ${font.size.l}px;
  color: ${p => p.color};
`;

const CallActivePageContent: FC = () => {
  const th = useTheme();

  const { call } = useContext(CallContext);
  const { account } = useContext(AccountContext);
  const { contact } = useFetchContactByNumber({
    user: account?.user || "none",
    number: call?.number ? extractPhoneNumber(call.number) : "none",
    enabled: !!account && !!call,
  });

  if (!call) return <NotFoundPage />

  return (
    <Container>
      <Top>
        <Photo size={140} src={contact?.photo} />
        <TitleContainer>
          <Title color={th.colors.text}>
            {contact ? contact.name : formatPhoneNumber(call.number)}
          </Title>
          {contact && (
            <Subtitle color={th.colors.subtitle}>
              {formatPhoneNumber(call.number)}
            </Subtitle>
          )}
        </TitleContainer>
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
