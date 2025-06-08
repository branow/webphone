import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import BackgroundMessage from "components/common/messages/BackgroundMessage";
import ClickableAccountPreview from "components/account/ClickableAccountPreview";
import { Account } from "services/accounts";
import { d } from "lib/i18n";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

interface Props {
  accounts: Account[];
}

const Accounts: FC<Props> = ({ accounts }) => {
  const { t } = useTranslation();

  return (
    <Container>
      {accounts.length === 0 && (
        <BackgroundMessage text={t(d.account.messages.noAccounts)} />
      )}
      {accounts.map(account => (
        <ClickableAccountPreview key={account.id} account={account} />
      ))}
    </Container>
  );
}

export default Accounts;
