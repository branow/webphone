import { FC } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import LanguageSetting from "./LanguageSetting";
import ChapterBar from "../contacts/info/ChapterBar";
import Chapter from "../contacts/info/Chapter";
import { d } from "../../lib/i18n";
import "./SettingsPage.css";

const SettingPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="setting-page">
      <div className="setting-header">
        <button
          className="transparent-btn setting-back-btn"
          onClick={() => navigate("/dialpad")}
        >
          <IoIosArrowBack />
        </button>
        <div className="setting-header-title">
          {t(d.settings.title)}
        </div>
      </div>
      <div className="setting-body">
        <Chapter title={t(d.settings.general)}>
          <div className="setting-general">
            <div className="setting-theme">
              <div>{t(d.settings.theme)}</div>
              <div className="development-status">
                {t(d.settings.comingSoon)}
              </div>
            </div>
            <LanguageSetting />
          </div>
        </Chapter>
        <ChapterBar />
        <Chapter title={t(d.settings.contacts)}>
          <button
            className="setting-chapter-btn"
            onClick={() => navigate("/contacts/import/feature-codes")}
          >
            {t(d.settings.featureCodes)}
          </button>
        </Chapter>
      </div>
    </div>
  );
}

export default SettingPage;
