import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import AdminNavTabs, { Tab } from "../../components/navtabs/AdminNavTabs";
import BackgroundMessage from "../../components/common/messages/BackgroundMessage";
import NotFoundPage from "../errors/NotFoundPage";
import { AccountContext } from "../../context/AccountContext";
import { useTheme } from "../../hooks/useTheme";
import { d } from "../../lib/i18n";
import { font, size } from "../../styles";

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const Title = styled.div<{ color: string }>`
  width: 100%;
  height: ${size.admin.top.h}px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const Body = styled.div<{ color: string }>`
  height: ${size.phone.h - size.navbar.h - size.admin.top.h}px;
  padding: 20px;
`;

const AdminPage: FC = () => {
  const { isAdmin } = useContext(AccountContext);
  const { t } = useTranslation();
  const th = useTheme();

  if (!isAdmin) {
    return <NotFoundPage />
  }

  return (
    <Container>
      <Title color={th.colors.textDisabled}>{t(d.admin.title)}</Title>
      <Body color={th.colors.text}>
        <BackgroundMessage text={t(d.admin.messages.commingSoon)} />
      </Body>
      <AdminNavTabs tabs={[Tab.Accounts]} />
    </Container>
  );
};

export default AdminPage;
