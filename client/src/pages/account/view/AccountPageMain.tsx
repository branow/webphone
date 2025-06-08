import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import FadeMotion from "../../../components/common/motion/FadeMotion";
import PendingPane from "../../../components/common/motion/PendingPane";
import ErrorBanner from "../../../components/common/messages/ErrorBanner";
import AccountPageTop from "./AccountPageTop";
import AccountPageBody from "./AccountPageBody";
import DeleteAccountWindow from "./DeleteAccountWindow";
import ContactApi from "../../../services/contacts";
import HistoryApi from "../../../services/history";
import AccountApi, { Account } from "../../../services/accounts";
import { d } from "../../../lib/i18n";
import { Paths } from "../../../routes";
import UserNavTabs, { Tab } from "../../../components/navtabs/UserNavTabs";
import { size } from "../../../styles";

const Container = styled.div<{ height: number }>`
  width: 100%;
  height: ${p => p.height}px;
`;

interface Props {
  account: Account;
}

const AccountPageMain: FC<Props> = ({ account }) => {
  const { t } = useTranslation();

  const isDefault = account.user === "default";

  const navigate = useNavigate();
  const edit = () => navigate(Paths.AccountUpdate({ id: account.id }));

  const [isRemoving, setIsRemoving] = useState(false);
  const queryClient = useQueryClient();

  const removing = useMutation({
    mutationFn: () => AccountApi.remove(account.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: AccountApi.QueryKeys.predicate });
      queryClient.invalidateQueries({ predicate: ContactApi.QueryKeys.predicate });
      queryClient.invalidateQueries({ predicate: HistoryApi.QueryKeys.predicate });
      navigate(Paths.Accounts());
    }
  });

  const remove = () => {
    removing.mutate();
    setIsRemoving(false);
  };

  return (
    <>
      <Container height={size.phone.h - size.navbar.h - size.account.top.h - (isDefault ? size.tabs.h : 0)}>
        <AccountPageTop
          edit={edit}
          remove={() => setIsRemoving(true)}
        />
        <AnimatePresence>
          {!removing.isPending && (
            <FadeMotion>
              <ErrorBanner error={removing.error} />
              <AccountPageBody account={account} />
            </FadeMotion>
          )}
          {removing.isPending && (
            <PendingPane
              label={t(d.ui.loading.deleting)}
              message={t(d.ui.loading.wait)}
            />
          )}
        </AnimatePresence>
        {isRemoving && (
          <DeleteAccountWindow
            accountName={account.username}
            close={() => setIsRemoving(false)}
            remove={remove}
          />
        )}
      </Container>
      {isDefault && (
        <UserNavTabs user={account.user} tabs={[Tab.History, Tab.Contacts]} />
      )}
    </>
  );
}

export default AccountPageMain;
