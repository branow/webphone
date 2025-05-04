import { FC } from "react";
import ContactEditForm from "./ContactEditForm";
import ContactApi, { ContactDetails } from "../../../services/contacts.ts";

const ContactCreatePage: FC = () => {
  const contact: ContactDetails = {
    id: "",
    name: "",
    numbers: [],
  };

  return (
    <ContactEditForm
      contact={contact}
      mutationFunc={(contact: ContactDetails) => ContactApi.create({ ...contact, photoUrl: contact.photo })}
    />
  );
}

export default ContactCreatePage;
