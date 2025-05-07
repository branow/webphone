import { FC } from "react"
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PageLayout from "./components/PageLayout";
import AuthProvider from "./providers/AuthProvider";
import SipProvider from "./providers/SipProvider";
import SipAccountPage from "./pages/account/SipAccountPage";
import HistoryPage from "./pages/history/HistoryPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import ContactInfoPage from "./pages/contacts/info/ContactInfoPage";
import ContactCreatePage from "./pages/contacts/edit/ContactCreatePage";
import ContactUpdatePage from "./pages/contacts/edit/ContactUpdatePage";
import FeatureCodesPage from "./pages/contacts/feature-codes/FeatureCodesPage";
import DialPadPage from "./pages/dialpad/DialPadPage";
import CallPage from "./pages/call/CallPage";
import CallActivePage from "./pages/call/CallActivePage";
import SettingsPage from "./pages/setting/SettingsPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import HomePage from "./pages/HomePage";
import TestDataPage from "./pages/dev/TestDataPage";
import "./App.css";


const devRoutes = import.meta.env.WEBPHONE_PROFILE === "dev" ? [
  {
    path: "/dev/test-data",
    element: <TestDataPage />,
  }
] : [];

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
        path: "/home",
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
        element: <FeatureCodesPage />
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
        path: "/call/active/:id",
        element: <CallActivePage />
      },
      {
        path: "/account",
        element: <SipAccountPage />
      },
      {
        path: "/settings",
        element: <SettingsPage />
      },
      ...devRoutes
    ]
  }
]);

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SipProvider>
            <RouterProvider router={router} />
          </SipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
