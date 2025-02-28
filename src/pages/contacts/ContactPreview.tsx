import { FC } from "react";
import { useNavigate } from "react-router";
import Photo from "../../components/Photo";
import { Contact } from "../../services/contacts";
import ContactNumbers from "./ContactNumbers";
import "./ContactPreview.css";

interface Props {
  contact: Contact,
  onClick?: () => void,
}

const ContactPreview: FC<Props> = ({ contact, onClick }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (onClick) { 
      onClick();
    } else {
      navigate(`/contacts/${contact.id}`);
    }
  }

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
