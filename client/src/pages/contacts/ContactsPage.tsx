import { FC, useContext } from "react";
import { styled } from "@linaria/react";
import UserNavTabs, { Tab } from "../../components/navtabs/UserNavTabs";
import NotFoundPage from "../errors/NotFoundPage";
import ContactsPageLoader from "./CotnactsPageLoader";
import { useTransitionAwareParam } from "../../hooks/useTransitionAwareParam";
import { AccountContext } from "../../context/AccountContext";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const ContactsPage: FC = () => {
  const { account } = useContext(AccountContext);
  const user = useTransitionAwareParam("user");

  if (!user) return <NotFoundPage />;

  return (
    <Container>
      <ContactsPageLoader user={user} />
      <UserNavTabs
        user={user}
        tabs={[(user !== account?.user ? Tab.Account : Tab.Dialpad), Tab.History]}
      />
    </Container>
  );
};

export default ContactsPage;
