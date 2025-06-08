import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import Chapter from "../../../components/common/pane/Chapter";
import ChapterBar from "../../../components/common/pane/ChapterBar";
import Paragraph from "../../../components/common/pane/Paragraph";
import { useTheme } from "../../../hooks/useTheme";
import { Account } from "../../../services/accounts";
import { d } from "../../../lib/i18n";
import { font } from "../../../styles";

const Container = styled.div`
  overflow-y: auto;
  height: 100%;
  padding: 0px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const ChapterInner = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AccountStatus = styled.div<{ color: string, bg: string }>`
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: 10px 10px 0 0;
  text-align: right;
  text-transform: uppercase;
  font-size: ${font.size.s}px;
  font-weight: bold;
  color: ${p => p.color};
  background-color: ${p => p.bg};
`;

interface Props {
  account: Account;
}

const AccountPageBody: FC<Props> = ({ account }) => {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Container>
      <AccountStatus
        color={th.colors.iconLight}
        bg={account.active ? th.colors.yellow : th.colors.surface2}
      >
        {account.active ? t(d.account.fields.active) : t(d.account.fields.inactive)}
      </AccountStatus>
      <Chapter title={t(d.account.fields.info)}>
        <ChapterInner>
          <Paragraph
            title={t(d.account.fields.user)}
            text={account.user}
          />
          <Paragraph
            title={t(d.account.fields.username)}
            text={account.username}
          />
        </ChapterInner>
      </Chapter>
      <ChapterBar />
      <Chapter title={t(d.account.fields.sipCredentials)}>
        <ChapterInner>
          <Paragraph
            title={t(d.account.fields.sipUsername)}
            text={account.sip.username}
          />
          <Paragraph
            title={t(d.account.fields.sipPassword)}
            text={account.sip.password}
          />
          <Paragraph
            title={t(d.account.fields.sipDomain)}
            text={account.sip.domain}
          />
          <Paragraph
            title={t(d.account.fields.sipProxy)}
            text={account.sip.proxy}
          />
        </ChapterInner>
      </Chapter>
    </Container>
  );
}

export default AccountPageBody;
