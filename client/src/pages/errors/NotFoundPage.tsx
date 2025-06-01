import { FC } from "react";
import {useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ErrorPage from "./ErrorPage";
import { d } from "../../lib/i18n";
import { Paths } from "../../routes";

const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <ErrorPage
      title={t(d.errors.e404.title)}
      message={t(d.errors.e404.message)}
      action={t(d.errors.takeMeHome)}
      actionFn={() => navigate(Paths.Dialpad())}
    />
  );
}

export default NotFoundPage;
