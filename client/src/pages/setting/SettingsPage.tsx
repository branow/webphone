import { FC } from "react";
import { useNavigate } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import ChapterBar from "../contacts/info/ChapterBar";
import Chapter from "../contacts/info/Chapter";
import "./SettingsPage.css";

const SettingPage: FC = () => {
  const navigate = useNavigate();

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
          SETTING
        </div>
      </div>
      <div className="setting-body">
        <Chapter title="General">
          <div className="setting-general">
            <div className="setting-theme">
              <div>Theme</div>
              <div className="development-status">
                Coming Soon
              </div>
            </div>
            <div className="setting-lang">
              <div>Language</div>
              <div className="development-status">
                Coming Soon
              </div>
            </div>
          </div>
        </Chapter>
        <ChapterBar />
        <Chapter title="Contacts">
          <button
            className="setting-chapter-btn"
            onClick={() => navigate("/contacts/import/feature-codes")}
          >
            Feature codes
          </button>
        </Chapter>
      </div>
    </div>
  );
}

export default SettingPage;
