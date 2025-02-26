import { FC, useState, createContext } from "react";
import { motion as m } from "framer-motion";
import { Tab } from "../Phone";
import NavTabs from "../NavTabs";
import ContactList from "./ContactList";
import ContactInfoPage from "./info/ContactInfoPage";
import { Contact } from "../../services/contactApi";
import "./ContactsPage.css";

interface ContactContextValue {
  contact: Contact | null;
  setContact: (contact: Contact) => void
  unsetContact: () => void
}

export const ContactContext = createContext<ContactContextValue | null>(null);

const ContactsPage: FC = () => {
  const [contact, setContact] = useState<Contact | null>(null);

  const value = {
    contact: contact,
    setContact: setContact,
    unsetContact: () => setContact(null),
  }

  return (
    <ContactContext.Provider value={value}>
      <m.div className="contacts-page"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0", opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.5, easy: "easeOut" }}
      >
        {contact && (
          <ContactInfoPage />
        )}
        {!contact && (
          <div>
            <ContactList />
            <NavTabs tabs={[Tab.DIALPAD, Tab.HISTORY]} />
          </div>
        )}
      </m.div>
    </ContactContext.Provider>
  )
};

export default ContactsPage;

