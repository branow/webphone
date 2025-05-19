import { FC } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { d } from "../../lib/i18n";
import "./ErrorPage.css";

const NotFoundPage: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="error-page">
      <div className="error-page-header">{t(d.errors.e404.title)}</div>
      <div className="error-page-message">
        {t(d.errors.e404.message)}
      </div>
      <Link className="transparent-rect-btn error-page-btn" to="/dialpad">
        {t(d.errors.takeMeHome)}
      </Link>
    </div>
  );
}

export default NotFoundPage;
