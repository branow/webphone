import { FC } from "react";
import NotFoundPage from "../../errors/NotFoundPage";
import UpdateAccountFetchingPage from "./UpdateAccountFetchingPage";
import { useTransitionAwareParam } from "../../../hooks/useTransitionAwareParam";

const UpdateAccountPage: FC = () => {
  const id = useTransitionAwareParam("id");

  if (!id) return <NotFoundPage />;

  return <UpdateAccountFetchingPage id={id} />;
};

export default UpdateAccountPage;
