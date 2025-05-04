import { FC } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import NotFoundPage from "../../errors/NotFoundPage";
import ContactEditForm from "./ContactEditForm";
import ContactApi from "../../../services/contacts.ts";

const ContactEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const contactId: string = params.id || "";

  if (!contactId) {
    return <NotFoundPage />
  }

  const fetchingContact = useQuery({
    queryKey: ContactApi.QueryKeys.contact(contactId),
    queryFn: () => ContactApi.get(contactId),
  });

  if (fetchingContact.isError) {
    return (<ErrorMessage error={fetchingContact.error}/>);
  }

  if (fetchingContact.isPending) {
    return (<PendingTab text="FETCHING" message="Please wait" />);
  }

  const contact = fetchingContact.data;

  return (
    <ContactEditForm
      contact={contact}
      mutationFunc={(contact) => ContactApi.update({ ...contact })}
    />
  );
}

export default ContactEditPage;
