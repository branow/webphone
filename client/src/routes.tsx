import { createBrowserRouter } from "react-router";
import PhoneLayout from "./components/phone/PhoneLayout";
import SipAccountPage from "./pages/account/SipAccountPage";
import HistoryPage from "./pages/history/HistoryPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import ContactPage from "./pages/contact/view/ContactPage";
import UpdateContactPage from "./pages/contact/update/UpdateContactPage";
import CreateContactPage from "./pages/contact/create/CreateContactPage";
import DialPadPage from "./pages/dialpad/DialPadPage";
import CallPage from "./pages/call/CallPage";
import CallActivePage from "./pages/call/active/CallActivePage";
import SettingPage from "./pages/setting/SettingPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import TestDataPage from "./pages/dev/TestDataPage";
import PageSwitcher from "./pages/PageSwitcher";
import { ReactNode } from "react";

export const Paths = {
  Dialpad: () => "/dialpad",
  Contacts: () => "/contacts",
  History: () => "/history",
  ContactView: ({ id }: { id: string }) => `/contact/view/${id}`,
  ContactCreate: () => "/contact/create",
  ContactUpdate: ({ id }: { id: string }) => `/contact/update/${id}`,
  Call: ({ number }: { number: string }) => `/call/number/${number}`,
  CallActive: ({ id }: { id: string }) => `/call/session/${id}`,
  Account: () => "/account",
  Settings: () => "/settings",
}

export interface Route {
  key: string,
  paths: string[],
  element: ReactNode,
  page?: ReactNode,
}

export const routes: Route[] = [
  {
    key: "dialpad",
    paths: [Paths.Dialpad(), "/", "/home", "/index.html", "/phone.html"],
    element: <PageSwitcher />,
    page: <DialPadPage />,
  },
  {
    key: "contacts",
    paths: [Paths.Contacts()],
    element: <PageSwitcher />,
    page: <ContactsPage />,
  },
  {
    key: "contact",
    paths: [Paths.ContactView({ id: ":id" })],
    element: <PageSwitcher />,
    page: <ContactPage />,
  },
  {
    key: "contact-create",
    paths: [Paths.ContactCreate()],
    element: <PageSwitcher />,
    page: <CreateContactPage />,
  },
  {
    key: "contact-update",
    paths: [Paths.ContactUpdate({ id: ":id" })],
    element: <PageSwitcher />,
    page: <UpdateContactPage />,
  },
  {
    key: "history",
    paths: [Paths.History()],
    element: <PageSwitcher />,
    page: <HistoryPage />,
  },
  {
    key: "call",
    paths: [Paths.Call({ number: ":number" })],
    element: <CallPage />,
  },
  {
    key: "call-active",
    paths: [Paths.CallActive({ id: ":id" })],
    element: <CallActivePage />,
  },
  {
    key: "account",
    paths: [Paths.Account()],
    element: <PageSwitcher />,
    page: <SipAccountPage />,
  },
  {
    key: "settings",
    paths: [Paths.Settings()],
    element: <PageSwitcher />,
    page: <SettingPage />,
  },
];

function isDevEnv() { return import.meta.env.WEBPHONE_PROFILE === "dev"; }

const devRoutes = [
  {
    path: "/dev/test-data",
    element: <TestDataPage />,
  }
];

export const CONTEXT_PATH = import.meta.env.WEBPHONE_CONTEXT_PATH;

const options = {
  basename: CONTEXT_PATH,
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PhoneLayout />,
    errorElement: <PhoneLayout><NotFoundPage /></PhoneLayout>,
    children: [
      ...routes.flatMap(route => route.paths.map(path => ({
        path: path,
        element: route.element,
      }))),
      ...( isDevEnv() ? devRoutes : []),
    ]
  }
], options);

