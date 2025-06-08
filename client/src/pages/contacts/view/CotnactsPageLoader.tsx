import { FC, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import BackgroundMessage from "components/common/messages/BackgroundMessage";
import ContactsPageMain from "pages/contacts/view/ContactsPageMain";
import { useFetchActiveAccount } from "hooks/fetch";
import { AccountContext } from "context/AccountContext";
import { d } from "lib/i18n";

const ContactsPageLoader: FC<{ user: string }> = ({ user }) => {
  const accountContext = useContext(AccountContext);
  const curAccount = accountContext.account;

  const { account, isPending, error } = useFetchActiveAccount({
    user: user,
    enabled: !curAccount || curAccount.user !== user,
    initial: curAccount,
  });

  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {account && (
        <FadeMotion key="main">
          <ContactsPageMain user={account.user} />
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

export default ContactsPageLoader;
