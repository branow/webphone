import { FC, useEffect } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import TextInput from "../../../components/TextInput";
import TextArea from "../../../components/TextArea";
import NumbersEditForm from "./NumbersEditForm";
import PhotoEditForm from "./PhotoEditForm";
import Chapter from "../info/Chapter";
import{ ContactDetails } from "../../../services/contacts";
import "./ContactEditForm.css";
import { EditableNumber, useContactEditForm } from "../../../hooks/useContactEditForm";

interface Props {
  contact: ContactDetails;
  loadPhoto: (photo: File) => void;
  save: (contact: ContactDetails) => void;
  cancel: () => void;
  savingError?: string;
}

const ContactEditForm: FC<Props> = ({ contact, loadPhoto, save, cancel, savingError }) => {
  const {
    error,
    updateError,
    form,
    updateForm,
  } = useContactEditForm({ contact });

  useEffect(() => updateError({ save: savingError }), [savingError])

  const setPhoto = (url: string) => updateForm({ photo: url });
  const setName = (name: string) => updateForm({ name });
  const setBio = (bio: string) => updateForm({ bio });
  const setNumbers = (numbers: EditableNumber[]) => updateForm({ numbers });

  const isValid = () => {
    return !error.name && !error.bio && !error.numberList && !error.numbers?.some(n => !!n);
  }

  return (
    <div className="contact-edit-form">
      <ErrorMessage error={error.save} />
      <Chapter>
        <PhotoEditForm contact={form} setPhoto={setPhoto} loadPhoto={loadPhoto} />
      </Chapter>

      <Chapter title="Name">
        <TextInput
          className="contact-edit-name"
          value={form.name}
          onValueChange={setName}
          error={error.name}
        />
      </Chapter>

      <Chapter title="Contact">
        <NumbersEditForm
          numbers={form.numbers}
          setNumbers={setNumbers}
          error={error.numberList}
          numberErrors={error.numbers}
        />
      </Chapter>

      <Chapter title="Bio">
        <TextArea
          className="contact-edit-bio"
          value={form.bio || ""}
          onValueChange={setBio}
          error={error.bio}
        />
      </Chapter>

      <div className="contact-edit-form-ctrls">
        <button
          type="button"
          className="contact-edit-form-ctrl-btn"
          onClick={() => save(form)}
          disabled={!isValid()}
        >
          Save
        </button>
        <button
          type="button"
          className="contact-edit-form-ctrl-btn"
          onClick={() => cancel()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ContactEditForm;
