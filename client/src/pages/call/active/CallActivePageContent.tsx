import { FC, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import FadeMotion from "components/common/motion/FadeMotion";
import NotFoundPage from "pages/errors/NotFoundPage";
import CallTopPane from "pages/call/active/CallTopPane";
import CallWaitPane from "pages/call/active/CallWaitPane";
import CallActivePane from "pages/call/active/CallActivePane";
import CallEndPane from "pages/call/active/CallEndPane";
import { useFetchContactByNumber } from "hooks/fetch";
import { AccountContext } from "context/AccountContext";
import { CallContext } from "context/CallContext";
import { extractPhoneNumber } from "util/format";

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

const CallActivePageContent: FC = () => {
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
      <CallTopPane contact={contact} />
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
