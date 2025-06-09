import { FC, useContext } from "react";
import ImportContactsPageForm from "pages/contacts/import/ImportContactsPageForm";
import NotFoundPage from "pages/errors/NotFoundPage";
import { AccountContext } from "context/AccountContext";
import { useTransitionAwareParam } from "hooks/useTransitionAwareParam";

const ContactsImportPage: FC = () => {
  const srcUser = useTransitionAwareParam("user");
  const { account } = useContext(AccountContext);
  if (!srcUser || !account) return <NotFoundPage />;

  return <ImportContactsPageForm srcUser={srcUser} targetUser={account.user} />;
};

export default ContactsImportPage;
