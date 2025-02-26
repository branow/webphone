import { FC } from "react";
import { Link } from "react-router";
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

const labels: Record<Tab, string> = {
  [Tab.DIALPAD]: "DIALPAD",
  [Tab.HISTORY]: "HISTORY",
  [Tab.CONTACTS]: "CONTACTS",
  [Tab.ACCOUNT]: "ACCOUNT",
};

const pathes: Record<Tab, string> = {
  [Tab.DIALPAD]: "/dialpad",
  [Tab.HISTORY]: "/history",
  [Tab.CONTACTS]: "/contacts",
  [Tab.ACCOUNT]: "/account",
};

const NavTabs: FC<Props> = ({ tabs }) => {
  return (
    <div className="nav-tabs">
      {tabs.map(tab =>
        <Link key={tab} className="nav-tab-btn" to={pathes[tab]}>
          {labels[tab]}
        </Link>
      )}
    </div>
  );
}

export default NavTabs;

