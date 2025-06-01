import { FC } from "react";
import { useTranslation } from "react-i18next";
import ErrorPage from "./ErrorPage";
import { d } from "../../lib/i18n";

interface Props {
  retry: () => void;
}

const AccountNotFoundPage: FC<Props> = ({ retry }) => {
  const { t } = useTranslation();

  return (
    <ErrorPage
      title={t(d.errors.account.title)}
      message={t(d.errors.account.message)}
      action={t(d.errors.retry)}
      actionFn={retry}
    />
  );
};

export default AccountNotFoundPage;
