import { createBrowserRouter } from "react-router";
import PageLayout from "./components/PageLayout";
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

export const CONTEXT_PATH = import.meta.env.WEBPHONE_CONTEXT_PATH;

const options = {
  basename: CONTEXT_PATH,
};



export const router = createBrowserRouter([
  {

    path: "/",
    element: <PageLayout />,
    errorElement: <NotFoundPage />,
    children: [
      ...["/", "/home", "/index.html", "/phone.html"].map(path => ({
        path: path,
        element: <HomePage />,
      })),
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
], options);
