import { FC } from "react";
import { motion as m } from "framer-motion";
import { Tab } from "../Phone";
import NavTabs from "../NavTabs";
import ContactList from "./ContactList";

const ContactsPage: FC = () => {
  return (
    <m.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: "0", opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.5, easy: "easeOut" }}
    >
      <div>
        <ContactList />
      </div>
      <NavTabs tabs={[Tab.DIALPAD, Tab.HISTORY]} />
    </m.div>
  )
};

export default ContactsPage;

