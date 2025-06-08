import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import AccountForm, { Operation } from "components/account/form/AccountForm";
import { useSaveAccount } from "hooks/useSaveAccount";
import AccountApi, { Account } from "services/accounts";
import { d } from "lib/i18n";

const emptyAccount: Account = {
  id: "",
  user: "",
  username: "",
  active: true,
  sip: {
    username: "",
    password: "",
    domain: "",
    proxy: "",
  }
}

const CreateAccountPage: FC = () => {
  const { account, save, isPending, error } = useSaveAccount({
    initAccount: emptyAccount,
    saveAccount: AccountApi.create,
  });

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {isPending && (
        <PendingPane
          label={t(d.ui.loading.creating)}
          message={d.ui.loading.wait}
        />
      )}
      {!isPending && (
        <FadeMotion key="contact">
          <AccountForm
            account={account}
            save={save}
            savingError={error ?? undefined}
            operation={Operation.Create}
          />
        </FadeMotion>
      )}
    </AnimatePresence>
  );
}

export default CreateAccountPage;
