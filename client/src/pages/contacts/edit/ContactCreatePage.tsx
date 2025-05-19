import { FC } from "react";
import { useTranslation } from "react-i18next";
import PendingTab from "../../../components/PendingTab";
import ContactEditForm from "./ContactEditForm";
import { useSaveContact } from "../../../hooks/useSaveContact";
import ContactApi, { ContactDetails } from "../../../services/contacts";
import { d } from "../../../lib/i18n";

const emptyContact: ContactDetails = {
  id: "",
  name: "",
  numbers: [],
}

const ContactCreatePage: FC = () => {
  const { t } = useTranslation();
  const { contact, loadPhoto, save, cancel, isPending, error } = useSaveContact({
    initContact: emptyContact,
    saveFunc: (contact: ContactDetails) => ContactApi.create({ ...contact, photoUrl: contact.photo })
  });

  if (isPending) {
    return (<PendingTab text={t(d.ui.loading.creating)} message={t(d.ui.loading.wait)} />)
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
