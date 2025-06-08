import { FC } from "react";
import NotFoundPage from "../../errors/NotFoundPage";
import AccountPageLoader from "./AccountPageLoader";
import { useTransitionAwareParam } from "../../../hooks/useTransitionAwareParam";

const AccountPage: FC = () => {
  const id = useTransitionAwareParam("id");
  if (!id) return <NotFoundPage />;

  return <AccountPageLoader id={id} />;
}

export default AccountPage;
