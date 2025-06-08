import { FC, useContext } from "react";
import { styled } from "@linaria/react";
import UserNavTabs, { Tab } from "components/navtabs/UserNavTabs";
import NotFoundPage from "pages/errors/NotFoundPage";
import HistoryPageLoader from "pages/history/HistoryPageLoader";
import { useTransitionAwareParam } from "hooks/useTransitionAwareParam";
import { AccountContext } from "context/AccountContext";

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

const HistoryPage: FC = () => {
  const { account } = useContext(AccountContext);
  const user = useTransitionAwareParam("user");

  if (!user) return <NotFoundPage />;

  return (
    <Container>
      <HistoryPageLoader user={user} />
      <UserNavTabs
        user={user}
        tabs={[Tab.Contacts, (user !== account?.user ? Tab.Account : Tab.Dialpad)]}
      />
    </Container>
  );
};

export default HistoryPage;
