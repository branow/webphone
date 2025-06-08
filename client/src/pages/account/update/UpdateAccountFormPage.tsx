import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import AccountForm, { Operation } from "components/account/form/AccountForm";
import AccountApi, { Account } from "services/accounts";
import { useSaveAccount } from "hooks/useSaveAccount";
import { d } from "lib/i18n";

const UpdateAccountFormPage: FC<{ initAccount: Account }> = ({ initAccount }) => {
  const { account, save, isPending, error } = useSaveAccount({
    initAccount: initAccount,
    saveAccount: (account: Account) => AccountApi.update({ ...account }),
  });

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {isPending && (
        <PendingPane
          label={t(d.ui.loading.updating)}
          message={d.ui.loading.wait}
        />
      )}
      {!isPending && (
        <FadeMotion key="contact">
          <AccountForm
            account={account}
            save={save}
            savingError={error ?? undefined}
            operation={Operation.Update}
          />
        </FadeMotion>
      )}
    </AnimatePresence>
  );
};

export default UpdateAccountFormPage;

