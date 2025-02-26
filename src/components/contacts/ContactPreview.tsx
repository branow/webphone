import { FC, useContext } from "react";
import Photo from "../Photo";
import { ContactContext } from "./ContactsPage";
import { Contact } from "../../services/contactApi";
import ContactNumbers from "./ContactNumbers";
import "./ContactPreview.css";

interface Props {
  contact: Contact,
}

const ContactPreview: FC<Props> = ({ contact }) => {
  const { setContact } = useContext(ContactContext)!;

  const handleOnClick = () => setContact(contact);

  return (
    <div className="contact-preview" onClick={handleOnClick}>
      <div className="contact-preview-photo">
        <Photo src={contact.photo} size="50px" alt="photo" />
      </div>
      <div className="contact-preview-info">
        <div className="contact-preview-info-name">{contact.name}</div>
        <div className="contact-preview-info-numbers">
          <ContactNumbers numbers={contact.numbers} />
        </div>
      </div>
    </div>
  );
}

export default ContactPreview;
