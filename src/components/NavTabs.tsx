import { FC, useContext } from "react";
import { TabContext, Tab } from "./Phone";
import Button from "./Button";
import "./NavTabs.css";

interface Props {
  tabs: Tab[]
}

const TabController: FC<Props> = ({ tabs }) => {
  const { switchTab } = useContext(TabContext)!;

  const labels: Record<Tab, string> = {
    [Tab.DIALPAD]: "DIALPAD",
    [Tab.HISTORY]: "HISTORY",
    [Tab.CONTACTS]: "CONTACTS",
    // The following tabs should not be allowed to use by user
    [Tab.CALL]: "CONTACTS",
    [Tab.ACCOUNT]: "CONTACTS",
  };

  return (
    <div className="tab-controller">
      {tabs.map(tab =>
        <Button
          key={tab}
          className="tab-btn"
          text={labels[tab]}
          onClick={() => switchTab(tab)}
        />
      )}
    </div>
  );
}

export default TabController;

