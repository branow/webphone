import { FC } from "react";
import { BsPersonFill } from "react-icons/bs";
import Photo from "../Photo";
import { Contact } from "../../services/contactApi";
import ContactNumbers from "./ContactNumbers";
import "./ContactPreview.css";

interface Props {
  contact: Contact,
}

const ContactPreview: FC<Props> = ({ contact }) => {
  return (
    <div className="contact-preview">
      <div className="contact-preview-photo">
        {
          contact.photo ? (
            <Photo src={contact.photo} alt="photo" />
          ) : (
            <div><BsPersonFill size="50px"/></div>
          )
        }
      </div>
      <div className="contact-preview-info">
        <div className="contact-preview-info-name">{contact.name}</div>
        <div className="contact-preview-info-numbers">
          <ContactNumbers iconSize="13px" numbers={contact.numbers} />
        </div>
      </div>
    </div>
  );
}

export default ContactPreview;
