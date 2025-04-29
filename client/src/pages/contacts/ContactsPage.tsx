import { FC } from "react";
import NavTabs, { Tab } from "../../components/NavTabs";
import ContactList from "./ContactList";
import "./ContactsPage.css";

const ContactsPage: FC = () => {
  return (
    <div className="contacts-page">
      <ContactList />
      <NavTabs tabs={[Tab.DIALPAD, Tab.HISTORY]} />
    </div>
  )
};

export default ContactsPage;

