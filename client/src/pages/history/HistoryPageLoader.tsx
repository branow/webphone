import { FC, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import FadeMotion from "../../components/common/motion/FadeMotion";
import PendingPane from "../../components/common/motion/PendingPane";
import BackgroundMessage from "../../components/common/messages/BackgroundMessage";
import HistoryPageMain from "./HistoryPageMain";
import { AccountContext } from "../../context/AccountContext";
import AccountApi from "../../services/accounts";
import { d } from "../../lib/i18n";

const HistoryPageLoader: FC<{ user: string }> = ({ user }) => {
  const { account } = useContext(AccountContext);

  const { data, isPending, error } = useQuery({
    queryKey: AccountApi.QueryKeys.accountActive(user),
    queryFn: () => AccountApi.getActive(user),
    enabled: !account || account.user !== user,
    initialData: account,
  });

  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {data && (
        <FadeMotion key="main">
          <HistoryPageMain user={data.user} />
        </FadeMotion>
      )}
      {error && (
        <FadeMotion key="error">
          <BackgroundMessage text={t(d.account.messages.noAccount)}/>
        </FadeMotion>
      )}
      {isPending && (
        <PendingPane
          label={t(d.ui.loading.loading)}
          message={t(d.ui.loading.wait)}
        />
      )}
    </AnimatePresence>
  );
};

export default HistoryPageLoader;
