import { FC, useContext } from "react";
import { matchPath, useParams } from "react-router";
import NotFoundPage from "../../errors/NotFoundPage";
import UpdateAccountFetchingPage from "./UpdateAccountFetchingPage";
import { PageSwitcherContext } from "../../../context/PageSwitcherContext";

const UpdateAccountPage: FC = () => {
  const params = useParams<{ id: string }>();
  const { previous } = useContext(PageSwitcherContext);
  let id = params.id;

  if (!id && previous) {
    const match = matchPath({ path: previous.path }, previous.location);
    id = match?.params?.id;
  }

  if (!id) return <NotFoundPage />;

  return <UpdateAccountFetchingPage id={id} />;
};

export default UpdateAccountPage;
