import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import ErrorBanner from "../../components/common/messages/ErrorBanner";
import FadeMotion from "../../components/common/motion/FadeMotion";
import PendingPane from "../../components/common/motion/PendingPane";
import NavTabs, { Tab } from "../../components/navtabs/NavTabs";
import HistoryPageTop from "./HistoryPageTop";
import HistoryPageBody from "./HistoryPageBody";
import HistoryApi from "../../services/history";
import { d } from "../../lib/i18n.ts";
import { AccountContext } from "../../context/AccountContext.ts";

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

const HistoryPage: FC = () => {
  const { t } = useTranslation();
  const { account } = useContext(AccountContext);
  const queryClient = useQueryClient();

  const cleaning = useMutation({
    mutationFn: HistoryApi.removeAll,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: HistoryApi.QueryKeys.predicate
      });
    },
  })

  return (
    <Container>
      <HistoryPageTop
        clean={() => cleaning.mutate(account?.user || "")}
        cleanDisabled={cleaning.isPending || cleaning.isError}
      />
      <AnimatePresence mode="wait">
        {!cleaning.isPending && (
          <FadeMotion key="records">
            <ErrorBanner error={cleaning.error} />
            <HistoryPageBody />
          </FadeMotion>
        )}
        {cleaning.isPending && (
          <PendingPane key="pending"
            label={t(d.ui.loading.cleaning)}
            message={t(d.ui.loading.wait)}
          />
        )}
      </AnimatePresence>
      <NavTabs tabs={[Tab.CONTACTS, Tab.DIALPAD]} />
    </Container>
  );
};

export default HistoryPage;
