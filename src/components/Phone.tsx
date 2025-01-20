import { FC, createContext, useState, useContext } from "react";
import NavBar from "./NavBar";
import { SipContext, RegistrationState } from "./account/SipProvider";
import SipAccountPage from "./account/SipAccountPage";
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
}

export interface TabValue {
  switchTab: (tab: Tab) => void
}

export const TabContext = createContext<TabValue | null>(null);

const Phone: FC = () => {
  const { registrationState } = useContext(SipContext)!;

  const [tab, setTab] = useState<Tab>(Tab.DIALPAD);

  const isRegistered = (): boolean => {
    return registrationState === RegistrationState.REGISTERED;
  }

  const switchTab = (tab: Tab) => setTab(tab);
  return (
    <div className="phone">
      <div className="phone-navbar">
        <NavBar />
      </div>
      <div className="phone-tab">
        { isRegistered() ? 
          (
            <HistoryProvider>
              <CallProvider>
                <TabContext.Provider value={{ switchTab }}>
                  {tab === Tab.CALL && (<CallPage />)}
                  {tab === Tab.DIALPAD && (<DialPadPage />)}
                  {tab === Tab.HISTORY && (<HistoryPage />)}
                </TabContext.Provider>
              </CallProvider>
            </HistoryProvider>
          ) :
          (
            <SipAccountPage />
          ) }
      </div>
    </div>
  );
};

export default Phone;
