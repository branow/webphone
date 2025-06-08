import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import ErrorBanner from "../../components/common/messages/ErrorBanner";
import FadeMotion from "../../components/common/motion/FadeMotion";
import PendingPane from "../../components/common/motion/PendingPane";
import HistoryPageTop from "./HistoryPageTop";
import HistoryPageBody from "./HistoryPageBody";
import { AccountContext } from "../../context/AccountContext.ts";
import HistoryApi from "../../services/history";
import { d } from "../../lib/i18n.ts";

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

const HistoryPageMain: FC<{ user: string }> = ({ user }) => {
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
        clean={() => cleaning.mutate(user)}
        cleanDisabled={account?.isDefault || cleaning.isPending || cleaning.isError}
      />
      <AnimatePresence mode="wait">
        {!cleaning.isPending && (
          <FadeMotion key="records">
            <ErrorBanner error={cleaning.error} />
            <HistoryPageBody user={user} />
          </FadeMotion>
        )}
        {cleaning.isPending && (
          <PendingPane key="pending"
            label={t(d.ui.loading.cleaning)}
            message={t(d.ui.loading.wait)}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default HistoryPageMain;
