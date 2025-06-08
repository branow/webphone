import { FC } from "react";
import NotFoundPage from "../../errors/NotFoundPage";
import CreateContactPageForm from "./CreateContactFormPage";
import { useTransitionAwareParam } from "../../../hooks/useTransitionAwareParam";

const CreateContactPage: FC = () => {
  const user = useTransitionAwareParam("user");

  if (!user) return <NotFoundPage />;

  return <CreateContactPageForm user={user} />;
}

export default CreateContactPage;
