import { FC } from "react";
import { useTranslation } from "react-i18next";
import ErrorPage from "./ErrorPage";
import { d } from "../../lib/i18n";

interface Props {
  login: () => void;
}

const AuthenticationFailedPage: FC<Props> = ({ login }) => {
  const { t } = useTranslation();

  return (
    <ErrorPage
      title={t(d.errors.auth.title)}
      message={t(d.errors.auth.message)}
      action={t(d.errors.auth.retryLogin)}
      actionFn={login}
    />
  );
};

export default AuthenticationFailedPage;
