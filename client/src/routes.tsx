import { ReactNode } from "react";
import { createBrowserRouter } from "react-router";
import PhoneLayout from "components/phone/PhoneLayout";
import HistoryPage from "pages/history/HistoryPage";
import ContactsPage from "pages/contacts/view/ContactsPage";
import ImportContactsPage from "pages/contacts/import/ImportContactsPage";
import ContactPage from "pages/contact/view/ContactPage";
import UpdateContactPage from "pages/contact/update/UpdateContactPage";
import CreateContactPage from "pages/contact/create/CreateContactPage";
import DialPadPage from "pages/dialpad/DialPadPage";
import CallPage from "pages/call/CallPage";
import CallActivePage from "pages/call/active/CallActivePage";
import SettingPage from "pages/setting/SettingPage";
import NotFoundPage from "pages/errors/NotFoundPage";
import TestDataPage from "pages/dev/TestDataPage";
import AccountsPage from "pages/accounts/AccountsPage";
import AccountPage from "pages/account/view/AccountPage";
import CreateAccountPage from "pages/account/create/CreateAccountPage";
import UpdateAccountPage from "pages/account/update/UpdateAccountPage";
import AdminPage from "pages/admin/AdminPage";
import PageSwitcher from "pages/PageSwitcher";

export const Paths = {
  Dialpad: () => "/dialpad",
  Contacts: ({ user }: { user: string }) => `/contacts/view/${user}`,
  ContactsImport: ({ user }: { user: string }) => `/contacts/import/user/${user}`,
  History: ({ user }: { user: string }) => `/history/view/${user}`,
  ContactView: ({ id }: { id: string }) => `/contact/view/${id}`,
  ContactCreate: ({ user }: { user: string }) => `/contact/create/${user}`,
  ContactUpdate: ({ id }: { id: string }) => `/contact/update/${id}`,
  Call: ({ number }: { number: string }) => `/call/number/${number}`,
  CallActive: ({ id }: { id: string }) => `/call/session/${id}`,
  Accounts: () => "/accounts",
  AccountView: ({ id }: { id: string }) => `/account/view/${id}`,
  AccountCreate: () => "/account/create",
  AccountUpdate: ({ id }: { id: string }) => `/account/update/${id}`,
  Settings: () => "/settings",
  Admin: () => "/admin",
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
    paths: [Paths.Contacts({ user: ":user" })],
    element: <PageSwitcher />,
    page: <ContactsPage />,
  },
  {
    key: "contacts-import",
    paths: [Paths.ContactsImport({ user: ":user" })],
    element: <PageSwitcher />,
    page: <ImportContactsPage />,
  },
  {
    key: "contact",
    paths: [Paths.ContactView({ id: ":id" })],
    element: <PageSwitcher />,
    page: <ContactPage />,
  },
  {
    key: "contact-create",
    paths: [Paths.ContactCreate({ user: ":user" })],
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
    paths: [Paths.History({ user: ":user" })],
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
    key: "accounts",
    paths: [Paths.Accounts()],
    element: <PageSwitcher />,
    page: <AccountsPage />,
  },
  {
    key: "account",
    paths: [Paths.AccountView({ id: ":id" })],
    element: <PageSwitcher />,
    page: <AccountPage />,
  },
  {
    key: "account-create",
    paths: [Paths.AccountCreate()],
    element: <PageSwitcher />,
    page: <CreateAccountPage />,
  },
  {
    key: "account-update",
    paths: [Paths.AccountUpdate({ id: ":id" })],
    element: <PageSwitcher />,
    page: <UpdateAccountPage />,
  },
  {
    key: "settings",
    paths: [Paths.Settings()],
    element: <PageSwitcher />,
    page: <SettingPage />,
  },
  {
    key: "admin",
    paths: [Paths.Admin()],
    element: <PageSwitcher />,
    page: <AdminPage />,
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

