import { FC } from "react";
import NotFoundPage from "pages/errors/NotFoundPage";
import CreateContactPageForm from "pages/contact/create/CreateContactFormPage";
import { useTransitionAwareParam } from "hooks/useTransitionAwareParam";

const CreateContactPage: FC = () => {
  const user = useTransitionAwareParam("user");

  if (!user) return <NotFoundPage />;

  return <CreateContactPageForm user={user} />;
}

export default CreateContactPage;
