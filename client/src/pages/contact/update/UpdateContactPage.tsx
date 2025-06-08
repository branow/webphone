import { FC } from "react";
import NotFoundPage from "../../errors/NotFoundPage";
import UpdateContactFetchingPage from "./UpdateContactFetchingPage";
import { useTransitionAwareParam } from "../../../hooks/useTransitionAwareParam";

const UpdateContactPage: FC = () => {
  const id = useTransitionAwareParam("id");

  if (!id) return <NotFoundPage />;

  return <UpdateContactFetchingPage id={id} />;
};

export default UpdateContactPage;
