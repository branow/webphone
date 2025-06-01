import { FC, ReactNode, useCallback, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ErrorContext, PrioritizedMessage } from "../context/ErrorContext";
import { AccountContext } from "../context/AccountContext";
import { SipContext } from "../context/SipContext";
import { d } from "../lib/i18n";

interface Props {
  children: ReactNode;
}

const ErrorProvider: FC<Props> = ({ children }) => {
  const [errors, setErrors] = useState(new Map<string, PrioritizedMessage>());

  const add = useCallback((key: string, message: PrioritizedMessage) => {
    setErrors(prev => new Map(prev.set(key, message)));
  }, []);

  const remove = useCallback((key: string) => {
    setErrors(prev => {
      const updated = new Map(prev);
      updated.delete(key);
      return updated;
    })
  }, []);

  const { t } = useTranslation();
  const { connectionError } = useContext(SipContext);

  useEffect(() => {
    const key = "pbxsever-connection";
    if (!connectionError) {
      remove(key);
      return;
    }

    const message = connectionError.name === "Rejected"
      ? t(d.account.errors.registration)
      : t(d.account.errors.connection);

    add(key, {
      priority: 29,
      message,
    })
  }, [connectionError, t, add, remove]);

  const { account } = useContext(AccountContext);

  useEffect(() => {
    const key = "no-account";
    if (account) {
      remove(key);
      return;
    }

    add(key, {
      priority: 19,
      message: t(d.account.messages.noAccountWarning),
    })
  }, [account, t, add, remove]);

  useEffect(() => {
    if (!account) return;

    const key = "default-account";
    if (!account.isDefault) {
      remove(key);
      return;
    }

    add(key, {
      priority: 19,
      message: t(d.account.messages.defaultAccountWarning),
    })
  }, [account?.isDefault, t, add, remove]);

  return (
    <ErrorContext.Provider value={{ errors, add, remove }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
