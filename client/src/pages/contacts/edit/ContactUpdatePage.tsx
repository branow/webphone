import { FC } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import NotFoundPage from "../../errors/NotFoundPage";
import ContactEditForm from "./ContactEditForm";
import { queryClient } from "../../../lib/query.ts";
import { QueryKeys, Contact, get } from "../../../services/contacts.ts";

const ContactEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const contactId: string = params.id || "";

  if (!contactId) {
    return <NotFoundPage />
  }

  const cachedContacts: Contact[] = queryClient.getQueryData([QueryKeys.contacts]) || [];
  const cachedContact = cachedContacts.find(contact => contact.id === contactId);
  
  const fetchingContact = useQuery({
    queryKey: [QueryKeys.contact, contactId],
    queryFn: () => get(contactId),
    enabled: !cachedContact,
    initialData: cachedContact,
  });

  if (fetchingContact.isError) {
    return (<ErrorMessage error={fetchingContact.error}/>);
  }

  if (fetchingContact.isLoading) {
    return (<PendingTab text="FETCHING" message="Please wait" />);
  }

  const contact = fetchingContact.data!;

  return (<ContactEditForm contact={contact} />);
}

export default ContactEditPage;
