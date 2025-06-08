import { FC, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import AuthenticationFailedPage from "pages/errors/AuthenticationFailedPage";
import { useAuth } from "hooks/useAuth";
import { AuthContext } from "context/AuthContext";
import { Auth, Role } from "services/auth";
import { d } from "lib/i18n";

interface Props {
  children: ReactNode;
}

const AuthProvider: FC<Props> = ({ children }) => {
  const { authenticated, user, error } = useAuth();

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {authenticated && user && (
        <FadeMotion key="auth">
          <AuthContext.Provider value={{
            authenticated,
            user: user.id,
            username: user.username,
            isAdmin: user.role === Role.Admin,
            role: user.role
          }}>
            {children}
          </AuthContext.Provider>
        </FadeMotion>
      )}
      {!authenticated && (
        <FadeMotion key="notAuth">
          <AnimatePresence mode="wait">
            {error && (
              <FadeMotion key="error">
                <AuthenticationFailedPage login={() => Auth().login()} />
              </FadeMotion>
            )}
            {!error && <PendingPane key="loading" label={t(d.ui.loading.authenticating)} />}
          </AnimatePresence>
        </FadeMotion>
      )}
    </AnimatePresence>
  );
};

export default AuthProvider;
