import { FC } from "react"
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import PageLayout from "./components/PageLayout";
import SipProvider from "./providers/SipProvider";
import CallProvider from "./providers/CallProvider";
import SipAccountPage from "./pages/account/SipAccountPage";
import HistoryPage from "./pages/history/HistoryPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import ContactInfoPage from "./pages/contacts/info/ContactInfoPage";
import ContactCreatePage from "./pages/contacts/edit/ContactCreatePage";
import ContactUpdatePage from "./pages/contacts/edit/ContactUpdatePage";
import FeatureNumbersPage from "./pages/contacts/feature-numbers/FeatureNumbersPage";
import DialPadPage from "./pages/dialpad/DialPadPage";
import CallPage from "./pages/call/CallPage";
import SettingsPage from "./pages/setting/SettingsPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import HomePage from "./pages/HomePage";
import { queryClient } from "./lib/query";
import "./App.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
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
        path: "/contacts/import/feature-codes",
        element: <FeatureNumbersPage />
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
      {
        path: "/settings",
        element: <SettingsPage />
      },
    ]
  }
]);

const App: FC = () => {
  return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <SipProvider>
            <CallProvider>
              <RouterProvider router={router} />
            </CallProvider>
          </SipProvider>
        </QueryClientProvider>
      </div>
  );
}

export default App;
