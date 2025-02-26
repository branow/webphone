import { FC, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { queryClient } from "../../../App";
import { ContactContext } from "../ContactsPage";
import DeleteContactWindow from "../DeleteContactWindow";
import ContactNumbers from "../ContactNumbers";
import Chapter from "./Chapter";
import ChapterBar from "./ChapterBar";
import Photo from "../../Photo";
import Button from "../../Button";
import PendingTab from "../../PendingTab";
import { ContactQueryKeys, deleteContact } from "../../../services/contactApi";
import "./ContactInfoPage.css";

const ContactInfoPage: FC = () => {
  const { contact, unsetContact } = useContext(ContactContext)!;
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const deletingContact = useMutation({
    mutationFn: () => deleteContact(contact!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ContactQueryKeys.CONTACTS]})
      unsetContact();
    }
  });

  const call = () => {}

  const handleDelete = () => {
    deletingContact.mutate();
  }

  const handleDeleteIntend = () => setIsConfirmingDelete(true);

  const handleEdit = () => {

  }

  if (deletingContact.isPending) {
    return (<PendingTab text="DELETING" message="Please wait" />);
  }

  return (
    <div className="contact-info-ctn">
      {isConfirmingDelete && (
        <DeleteContactWindow
          contactName={contact!.name}
          close={() => setIsConfirmingDelete(false)}
          deleteContact={handleDelete}
        />
      )}
      <div className="contact-info-top">
        <div className="contact-info-top-left">
          <Button
            className="transparent-btn contact-info-back-btn"
            Icon={IoIosArrowBack}
            onClick={unsetContact}
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
            <Photo src={contact!.photo} size="100px" alt={contact!.name} />
            <div className="contact-info-header-name">{contact!.name}</div>
          </div>
        </Chapter>
        <ChapterBar />
        <Chapter title="Bio">
          <div>{contact!.bio}</div>
        </Chapter>
        <ChapterBar />
        <Chapter title="Contact">
          <ContactNumbers numbers={contact!.numbers} call={call} />
        </Chapter>
      </div>
    </div>
  );
}

export default ContactInfoPage;

