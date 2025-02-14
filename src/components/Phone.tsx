import { FC, createContext, useState } from "react";
import NavBar from "./NavBar";
import SipAccountPage from "./account/SipAccountPage";
import SipProvider from "./account/SipProvider";
import HistoryProvider from "./history/HistoryProvider";
import HistoryPage from "./history/HistoryPage";
import DialPadPage from "./dialpad/DialPadPage";
import CallProvider from "./call/CallProvider";
import CallPage from "./call/CallPage";
import "./Phone.css";

export enum Tab {
  CALL = "call",
  DIALPAD = "dialpad",
  HISTORY = "history",
  ACCOUNT = "account"
}

export interface TabValue {
  switchTab: (tab: Tab) => void
}

export const TabContext = createContext<TabValue | null>(null);

const Phone: FC = () => {
  const [tab, setTab] = useState<Tab>(Tab.DIALPAD);

  const switchTab = (tab: Tab) => setTab(tab);
  return (
    <div className="phone">
      <div className="phone-navbar">
        <NavBar />
      </div>
        <SipProvider>
          <HistoryProvider>
            <CallProvider>
              <TabContext.Provider value={{ switchTab }}>
                <div className="phone-tab">
                  {tab === Tab.CALL && (<CallPage />)}
                  {tab === Tab.DIALPAD && (<DialPadPage />)}
                  {tab === Tab.HISTORY && (<HistoryPage />)}
                  {tab === Tab.ACCOUNT && (<SipAccountPage />)}
                </div>
              </TabContext.Provider>
            </CallProvider>
          </HistoryProvider>
        </SipProvider>
    </div>
  );
};

export default Phone;
