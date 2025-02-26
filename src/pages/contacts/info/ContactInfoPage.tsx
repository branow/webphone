import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { queryClient } from "../../../lib/query";
import Photo from "../../../components/Photo";
import Button from "../../../components/Button";
import PendingTab from "../../../components/PendingTab";
import ErrorMessage from "../../../components/ErrorMessage";
import NotFoundPage from "../../errors/NotFoundPage";
import Chapter from "./Chapter";
import ChapterBar from "./ChapterBar";
import DeleteContactWindow from "../DeleteContactWindow";
import ContactNumbers from "../ContactNumbers";
import { QueryKeys, Contact, get, remove } from "../../../services/contacts.ts";
import "./ContactInfoPage.css";

const ContactInfoPage: FC = () => {
  const navigate = useNavigate();
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
  })
  
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const deletingContact = useMutation({
    mutationFn: () => remove(contactId),
    onSuccess: () => {
      navigate("/contacts");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.contacts] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.contact, contact.id] });
    }
  });

  const call = (number: string) => navigate(`/call/${number}`);

  const handleDelete = () => {
    deletingContact.mutate();
  }

  const handleDeleteIntend = () => setIsConfirmingDelete(true);

  const handleEdit = () => navigate(`/contacts/update/${contact.id}`);

  if (fetchingContact.isError) {
    return (<ErrorMessage error={fetchingContact.error}/>);
  }

  if (fetchingContact.isLoading) {
    return (<PendingTab text="FETCHING" message="Please wait" />);
  }

  if (deletingContact.isPending) {
    return (<PendingTab text="DELETING" message="Please wait" />);
  }

  const contact = fetchingContact.data!;

  return (
    <div className="contact-info-ctn">
      {isConfirmingDelete && (
        <DeleteContactWindow
          contactName={contact.name}
          close={() => setIsConfirmingDelete(false)}
          deleteContact={handleDelete}
        />
      )}
      <div className="contact-info-top">
        <div className="contact-info-top-left">
          <Button
            className="transparent-btn contact-info-back-btn"
            Icon={IoIosArrowBack}
            onClick={() => navigate("/contacts")}
          />
        </div>
        <div className="contact-info-top-right">
          <Button
            className="transparent-btn contact-info-edit-btn"
            Icon={MdEdit}
            onClick={handleEdit}
          />
          <Button
            className="transparent-btn delete-btn contact-info-delete-btn"
            Icon={BsFillTrash3Fill}
            onClick={handleDeleteIntend}
          />
        </div>
      </div>
      <div className="contact-info">
        <Chapter>
          <div className="contact-info-header">
            <Photo src={contact.photo} size="100px" alt={contact.name} />
            <div className="contact-info-header-name">{contact.name}</div>
          </div>
        </Chapter>
        <ChapterBar />
        <Chapter title="Bio">
          <div>{contact.bio}</div>
        </Chapter>
        <ChapterBar />
        <Chapter title="Contact">
          <ContactNumbers numbers={contact.numbers} call={call} />
        </Chapter>
      </div>
    </div>
  );
}

export default ContactInfoPage;

