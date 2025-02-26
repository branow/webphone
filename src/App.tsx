import { FC } from "react"
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import PhoneContainer from "./components/PhoneContainer";
import NavBar from "./components/NavBar";
import SipProvider from "./providers/SipProvider";
import HistoryProvider from "./providers/HistoryProvider";
import CallProvider from "./providers/CallProvider";
import SipAccountPage from "./pages/account/SipAccountPage";
import HistoryPage from "./pages/history/HistoryPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import ContactInfoPage from "./pages/contacts/info/ContactInfoPage";
import ContactCreatePage from "./pages/contacts/edit/ContactCreatePage";
import ContactUpdatePage from "./pages/contacts/edit/ContactUpdatePage";
import DialPadPage from "./pages/dialpad/DialPadPage";
import CallPage from "./pages/call/CallPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import HomePage from "./pages/HomePage";
import { queryClient } from "./lib/query";
import "./App.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/dialpad",
    element: <DialPadPage />
  },
  {
    path: "/contacts",
    element: <ContactsPage />,
  },
  {
    path: "/contacts/:id",
    element: <ContactInfoPage />
  },
  {
    path: "/contacts/create",
    element: <ContactCreatePage />
  },
  {
    path: "/contacts/update/:id",
    element: <ContactUpdatePage />
  },
  {
    path: "/history",
    element: <HistoryPage />
  },
  {
    path: "/call/:number",
    element: <CallPage />
  },
  {
    path: "/account",
    element: <SipAccountPage />
  },
]);

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <PhoneContainer>
          <div className="phone">
            <div className="phone-navbar">
              <NavBar />
            </div>
            <div className="phone-body">
              <SipProvider>
                <HistoryProvider>
                  <CallProvider>
                    <RouterProvider router={router} />
                  </CallProvider>
                </HistoryProvider>
              </SipProvider>
            </div>
          </div>
        </PhoneContainer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
