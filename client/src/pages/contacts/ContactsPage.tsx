import { FC, useState } from "react";
import { styled } from "@linaria/react";
import NavTabs, { Tab } from "../../components/navtabs/NavTabs";
import ContactsPageTop from "./ContactsPageTop";
import ContactsPageBody from "./ContactsPageBody";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const ContactsPage: FC = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <Container>
      <ContactsPageTop setQuery={setQuery} />
      <ContactsPageBody query={query} />
      <NavTabs tabs={[Tab.DIALPAD, Tab.HISTORY]} />
    </Container>
  )
};

export default ContactsPage;

