import { FC } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import NotFoundPage from "../../errors/NotFoundPage";
import ContactEditForm from "./ContactEditForm";
import ContactApi, { ContactDetails } from "../../../services/contacts.ts";
import { useSaveContact } from "../../../hooks/useSaveContact.ts";

const ContactUpdatePage: FC = () => {
  const params = useParams<{ id: string }>();
  const contactId: string = params.id || "";

  if (!contactId) {
    return <NotFoundPage />
  }

  return (
    <ContactUpdateFetchingPage contactId={contactId} />
  );
};

export default ContactUpdatePage;

const ContactUpdateFetchingPage: FC<{ contactId: string }> = ({ contactId }) => {
  const { data, isError, error, isPending } = useQuery({
    queryKey: ContactApi.QueryKeys.contact(contactId),
    queryFn: () => ContactApi.get(contactId),
  });

  if (isError) {
    return (<ErrorMessage error={error}/>);
  }

  if (isPending) {
    return (<PendingTab text="FETCHING" message="Please wait" />);
  }

  return (
    <ContactUpdateSavingPage
      initContact={data}
    />
  );
};

const ContactUpdateSavingPage: FC<{ initContact: ContactDetails }> = ({ initContact }) => {
  const { contact, isPending, loadPhoto, save, cancel, error } = useSaveContact({
    initContact: initContact,
    saveFunc: (contact: ContactDetails) => ContactApi.update({ ...contact }),
  });

  if (isPending) {
    return (<PendingTab text="updating" message="Please wait" />);
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
};

