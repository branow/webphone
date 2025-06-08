import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import ChapterBar from "components/common/pane/ChapterBar";
import Chapter from "components/common/pane/Chapter";
import AdminDashboardLink from "pages/setting/AdminDashboardLink";
import SettingPageTop from "pages/setting/SettingPageTop";
import GeneralSetting from "pages/setting/GeneralSetting";
import { d } from "lib/i18n";
import { size } from "styles";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const SettingBody = styled.div`
  height: ${size.phone.h - size.navbar.h - size.setting.top.h}px;
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SettingPage: FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <SettingPageTop />
      <SettingBody>
        <AdminDashboardLink />
        <Chapter title={t(d.settings.general)}>
          <GeneralSetting />
        </Chapter>
        <ChapterBar />
      </SettingBody>
    </Container>
  );
}

export default SettingPage;
