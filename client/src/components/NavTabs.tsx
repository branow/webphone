import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { d } from "../lib/i18n";
import "./NavTabs.css";

export enum Tab {
  DIALPAD = "dialpad",
  HISTORY = "history",
  ACCOUNT = "account",
  CONTACTS = "contacts",
}

interface Props {
  tabs: Tab[];
}

const pathes: Record<Tab, string> = {
  [Tab.DIALPAD]: "/dialpad",
  [Tab.HISTORY]: "/history",
  [Tab.CONTACTS]: "/contacts",
  [Tab.ACCOUNT]: "/account",
};

const NavTabs: FC<Props> = ({ tabs }) => {
  const { t } = useTranslation();

  return (
    <div className="nav-tabs">
      {tabs.map(tab =>
        <Link key={tab} className="nav-tab-btn" to={pathes[tab]}>
          {t(d.ui.tabs[tab])}
        </Link>
      )}
    </div>
  );
}

export default NavTabs;
