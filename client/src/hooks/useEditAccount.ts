import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AccountContext } from "context/AccountContext";
import { Account } from "services/accounts";
import { d } from "lib/i18n";
import { validator } from "util/validator";

export enum Mode {
  User="user",
  Self="self",
  Default="default",
}

export type EditableAccount = {
  id: string;
  user: string;
  username: string;
  active: boolean;
  sipUsername: string;
  sipPassword: string;
  sipDomain: string;
  sipProxy: string;
};

export interface AccountError {
  user: string;
  username: string;
  sipUsername: string;
  sipPassword: string;
  sipDomain: string;
  sipProxy: string;
}

interface Props {
  initAccount: Account;
}

function calcMode(initAccount: Account, curAccount?: Account): Mode {
  if (initAccount.user === curAccount?.user) return Mode.Self;
  if (initAccount.user === "default") return Mode.Default
  return Mode.User;
}

export function useEditAccount({ initAccount } : Props) {
  const { user, username, account } = useContext(AccountContext);
  const [form, setForm] = useState(mapEditableAccount(initAccount));
  const [mode, setMode] = useState(calcMode(initAccount, account));
  const [error, setError] = useState<AccountError>();

  useEffect(() => validate(), [form]);

  const { t } = useTranslation();

  const validateUser = (user: string) => validator(user)
      .notBlank(t(d.account.errors.emptyUser))
      .max(100, t(d.account.errors.longUser, { max: 100 }))
      .validate();

  const validateUsername = (username: string) => validator(username)
      .notBlank(t(d.account.errors.emptyUsername))
      .max(100, t(d.account.errors.longUsername, { max: 100 }))
      .validate();

  const validateSipUsername = (sipUsername: string) => validator(sipUsername)
      .notBlank(t(d.account.errors.emptySipUsername))
      .max(100, t(d.account.errors.longSipUsername, { max: 100 }))
      .validate();

  const validateSipPassword = (sipPassword: string) => validator(sipPassword)
      .notBlank(t(d.account.errors.emptySipPassword))
      .max(100, t(d.account.errors.longSipPassword, { max: 100 }))
      .validate();

  const validateSipDomain = (sipDomain: string) => validator(sipDomain)
      .notBlank(t(d.account.errors.emptySipDomain))
      .max(200, t(d.account.errors.longSipDomain, { max: 200 }))
      .validate();

  const validateSipProxy = (sipProxy: string) => validator(sipProxy)
      .notBlank(t(d.account.errors.emptySipProxy))
      .max(200, t(d.account.errors.longSipProxy, { max: 200 }))
      .validate();

  const validate = () => {
    const error = {
      user: validateUser(form.user),
      username: validateUsername(form.username),
      sipUsername: validateSipUsername(form.sipUsername),
      sipPassword: validateSipPassword(form.sipPassword),
      sipDomain: validateSipDomain(form.sipDomain),
      sipProxy: validateSipProxy(form.sipProxy),
    };

    const isError = error.user
      || error.username
      || error.sipUsername
      || error.sipPassword
      || error.sipDomain
      || error.sipProxy;

    setError(isError ? error : undefined);
  }

  const updateForm = (updates: Partial<EditableAccount>) =>
    setForm(prev => ({ ...prev, ...updates }))

  useEffect(() => {
    switch(mode) {
      case Mode.Self:
        updateForm({ user, username });
        break;
      case Mode.Default:
        updateForm({ user: "default", username: "default" });
        break;
    }
  }, [mode]);

  const modes = user === account?.user
    ? [Mode.User, Mode.Default]
    : [Mode.User, Mode.Self, Mode.Default];

  return {
    error,
    form,
    updateForm,
    modes,
    mode,
    setMode,
  };
}

export function mapEditableAccount(account: Account): EditableAccount {
  return {
    ...account,
    sipUsername: account.sip.username,
    sipPassword: account.sip.password,
    sipDomain: account.sip.domain,
    sipProxy: account.sip.proxy,
  };
}

export function mapAccount(account: EditableAccount): Account {
  return {
    ...account,
    sip: {
      username: account.sipUsername,
      password: account.sipPassword,
      domain: account.sipDomain,
      proxy: account.sipProxy,
    },
  };
}
