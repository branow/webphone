import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "../../../components/common/motion/FadeMotion";
import ErrorBanner from "../../../components/common/messages/ErrorBanner";
import TransparentRectButton from "../../../components/common/button/TransparentRectButton";
import PendingPane from "../../../components/common/motion/PendingPane";
import UpdateAccountFormPage from "./UpdateAccountFormPage";
import AccountApi from "../../../services/accounts";
import { d } from "../../../lib/i18n";

const UpdateAccountFetchingPage: FC<{ id: string }> = ({ id }) => {
  const { data, error, isPending } = useQuery({
    queryKey: AccountApi.QueryKeys.account(id),
    queryFn: () => AccountApi.get(id),
  });

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {data && (
        <FadeMotion key="contact">
          <UpdateAccountFormPage initAccount={data} />
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
};

export default UpdateAccountFetchingPage;
