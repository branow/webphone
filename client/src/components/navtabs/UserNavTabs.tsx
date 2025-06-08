import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import NavTabs, { NavTab } from "./NabTabs";
import { useFetchActiveAccount } from "../../hooks/fetch";
import { d } from "../../lib/i18n";
import { Paths } from "../../routes";

export enum Tab {
  Dialpad = "dialpad",
  History = "history",
  Contacts = "contacts",
  Account = "account",
}

interface Props {
  user: string;
  tabs: Tab[];
}

const UserNavTabs: FC<Props> = ({ user, tabs }) => {
  const { account } = useFetchActiveAccount({ user, enabled: !!user });
  const { t } = useTranslation();

  const toLink = useCallback((tab: Tab): NavTab => {
    return {
      [Tab.Dialpad]: {
        label: t(d.ui.tabs.dialpad),
        path: Paths.Dialpad()
      },
      [Tab.History]: {
        label: t(d.ui.tabs.history),
        path: Paths.History({ user: user }),
        disabled: !account
      },
      [Tab.Contacts]: {
        label: t(d.ui.tabs.contacts),
        path: Paths.Contacts({ user: user }),
        disabled: !account
      },
      [Tab.Account]: {
        label: t(d.ui.tabs.account),
        path: Paths.AccountView({ id: account?.id || "" }),
        disabled: !account
      },
    }[tab];
  }, [account]);

  return <NavTabs tabs={tabs.map(toLink)} />;
}

export default UserNavTabs;
