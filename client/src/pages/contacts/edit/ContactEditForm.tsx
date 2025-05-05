import { FC, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/Button";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import NumbersEditForm from "./NumbersEditForm";
import BioEditForm from "./BioEditForm";
import NameEditForm from "./NameEditForm";
import PhotoEditForm from "./PhotoEditForm";
import Chapter from "../info/Chapter";
import ContactApi, { Number, ContactDetails } from "../../../services/contacts";
import PhotoApi from "../../../services/photos";
import { hex } from "../../../util/identifier";
import "./ContactEditForm.css";


export type EditableNumber = Number & { id: string };

export type EditableContact = {
  id: string;
  name: string;
  photo?: string;
  bio?: string;
  numbers: EditableNumber[]
};

function mapEditableContact(contact: ContactDetails): EditableContact {
  return { ...contact, numbers: contact.numbers.map(mapEditableNumber) };
}

function mapEditableNumber(number: Number): EditableNumber {
  return { ...number, id: hex(4) };
}


interface Props {
  contact: ContactDetails;
  mutationFunc: (contact: ContactDetails) => Promise<ContactDetails>
}

const ContactEditForm: FC<Props> = ({ contact, mutationFunc }) => {
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [localContact, setLocalContact] = useState<EditableContact>(
    mapEditableContact(contact)
  );

  const setName = (name: string) => setLocalContact({ ...localContact, name: name });
  const setBio = (bio: string) => setLocalContact({ ...localContact, bio: bio });
  const setPhoto = (url: string) => setLocalContact({ ...localContact, photo: url });
  const setNumbers = (numbers: EditableNumber[]) => setLocalContact({ ...localContact, numbers: numbers });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const savingContact = useMutation({
    mutationFn: async (contact: ContactDetails) => {
      const files = photoInputRef.current!.files;
      if (files && files.length > 0) {
        const photo = files.item(files.length - 1)!;
        const response = await PhotoApi.upload(photo);
        contact.photo = response.id;
      }
      return mutationFunc(contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: ContactApi.QueryKeys.predicate });
      navigate('/contacts');
    }
  });

  const handleSave = () => {
    savingContact.mutate(localContact);
  }

  const handleCancel = () => navigate("/contacts");

  if (savingContact.isPending) {
    return (<PendingTab text="LOADING" message="Please wait" />)
  }

  return (
    <div className="contact-edit-form">
      <ErrorMessage error={savingContact.isError ? savingContact.error!.message : ""} />
      <Chapter>
        <PhotoEditForm contact={localContact} setPhoto={setPhoto} inputRef={photoInputRef} />
      </Chapter>

      <Chapter title="Name">
        <NameEditForm
          name={localContact.name}
          setName={setName}
        />
      </Chapter>

      <Chapter title="Contact">
        <NumbersEditForm
          numbers={localContact.numbers}
          setNumbers={setNumbers}
        />
      </Chapter>

      <Chapter title="Bio">
        <BioEditForm
          bio={localContact.bio}
          setBio={setBio}
        />
      </Chapter>

      <div className="contact-edit-form-ctrls">
        <Button
          className="contact-edit-form-ctrl-btn"
          text="SAVE"
          onClick={handleSave}
        />
        <Button
          className="contact-edit-form-ctrl-btn"
          text="CANCEL"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
}

export default ContactEditForm;
