import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "../../../components/common/motion/FadeMotion";
import ErrorBanner from "../../../components/common/messages/ErrorBanner";
import TransparentRectButton from "../../../components/common/button/TransparentRectButton";
import PendingPane from "../../../components/common/motion/PendingPane";
import AccountPageMain from "./AccountPageMain";
import { useFetchAccount } from "../../../hooks/fetch";
import { d } from "../../../lib/i18n";

const AccountPageLoader: FC<{ id: string }> = ({ id }) => {
  const { account, isPending, error } = useFetchAccount({ id, enabled: !!id });
  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {account && (
        <FadeMotion key="account">
          <AccountPageMain account={account} />
        </FadeMotion>
      )}
      {error && (
        <FadeMotion key="error">
          <ErrorBanner error={error} />
          <TransparentRectButton>
            {t(d.errors.takeMeHome)}
          </TransparentRectButton>
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
}

export default AccountPageLoader;
