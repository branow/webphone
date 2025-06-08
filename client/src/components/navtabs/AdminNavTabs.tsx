import { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import NavTabs, { NavTab } from "components/navtabs/NabTabs";
import { AccountContext } from "context/AccountContext";
import { d } from "lib/i18n";
import { Paths } from "routes";

export enum Tab {
  Accounts = "accounts",
  Admin = "admin",
}

interface Props {
  tabs: Tab[];
}

const AdminNavTabs: FC<Props> = ({ tabs }) => {
  const { isAdmin, account } = useContext(AccountContext);
  const { t } = useTranslation();

  const toLink = useCallback((tab: Tab): NavTab => {
    return {
      [Tab.Accounts]: {
        label: t(d.ui.tabs.accounts),
        path: Paths.Accounts(),
        disabled: !isAdmin
      },
      [Tab.Admin]: {
        label: t(d.ui.tabs.admin),
        path: Paths.Admin(), disabled: !isAdmin
      },
    }[tab];
  }, [isAdmin, account]);

  return <NavTabs tabs={tabs.map(toLink)} />;
}

export default AdminNavTabs;
