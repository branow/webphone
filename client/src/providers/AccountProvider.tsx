import { FC, ReactNode, useContext, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PendingPane from "components/common/motion/PendingPane";
import FadeMotion from "components/common/motion/FadeMotion";
import AccountNotFoundPage from "pages/errors/AccountNotFoundPage";
import { useAccount } from "hooks/useAccount";
import { AccountContext } from "context/AccountContext";
import { AuthContext } from "context/AuthContext";
import { SipContext } from "context/SipContext";
import { d } from "lib/i18n";

interface Props {
  children: ReactNode;
}

const AccountProvider: FC<Props> = ({ children }) => {
  const { user, username, isAdmin } = useContext(AuthContext);
  const { setAccount } = useContext(SipContext);
  const { account, error, isPending, refetch } = useAccount();

  useEffect(() => {
    if (account && account.sip) setAccount(account.sip);
  }, [account]);

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {isPending && <PendingPane key="loading" label={t(d.ui.loading.loading)} />}
      {!isPending && (isAdmin || account) && (
        <FadeMotion key="data">
          <AccountContext.Provider
            value={{
              user,
              username,
              isAdmin,
              account,
            }}
          >
            { children }
          </AccountContext.Provider>
        </FadeMotion>
      )}
      {!isPending && error && !isAdmin && (
        <FadeMotion key="error">
          <AccountNotFoundPage retry={refetch} />
        </FadeMotion>
      )}
    </AnimatePresence>
  );
};

export default AccountProvider;
