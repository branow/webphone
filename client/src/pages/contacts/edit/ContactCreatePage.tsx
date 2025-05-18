import { FC } from "react";
import ContactEditForm from "./ContactEditForm";
import { useSaveContact } from "../../../hooks/useSaveContact.ts";
import ContactApi, { ContactDetails } from "../../../services/contacts.ts";
import PendingTab from "../../../components/PendingTab.tsx";

const emptyContact: ContactDetails = {
  id: "",
  name: "",
  numbers: [],
}

const ContactCreatePage: FC = () => {
  const { contact, loadPhoto, save, cancel, isPending, error } = useSaveContact({
    initContact: emptyContact,
    saveFunc: (contact: ContactDetails) => ContactApi.create({ ...contact, photoUrl: contact.photo })
  });

  if (isPending) {
    return (<PendingTab text="CREATING" message="Please wait" />)
  }

  return (
    <ContactEditForm
      contact={contact}
      loadPhoto={loadPhoto}
      save={save}
      cancel={cancel}
      savingError={error?.message}
    />
  );
}

export default ContactCreatePage;
