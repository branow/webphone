import { FC } from "react";
import ContactEditForm from "./ContactEditForm";
import { Contact } from "../../../services/contacts.ts";

const ContactCreatePage: FC = () => {
  const contact: Contact = {
    id: "",
    name: "",
    numbers: [],
  };

  return (<ContactEditForm contact={contact} />);
}

export default ContactCreatePage;
