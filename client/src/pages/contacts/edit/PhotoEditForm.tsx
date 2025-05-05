import { FC, useState, RefObject } from "react";
import { BsCloudUploadFill } from "react-icons/bs";
import Photo from "../../../components/Photo";
import FileChooser from "../../../components/FileChooser";
import ErrorMessage from "../../../components/ErrorMessage";
import Hover from "../../../components/Hover";
import "./ContactEditForm.css";
import { EditableContact } from "./ContactEditForm";

interface Props {
  contact: EditableContact;
  setPhoto: (url: string) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const PhotoEditForm: FC<Props> = ({ contact, setPhoto, inputRef }) => {
  const [error, setError] = useState<string>("");

  const handleLoadPhoto = (file: File) => {
    if (file.size > 1024 * 1024 * 8) { // not bigger then 8 megabytes
      setError("The chosen photo is too large! Please select a photo smaller then 8 MB.");
      return;
    }
    setPhoto(URL.createObjectURL(file));
  }

  const handleStartedLoadPhoto = () => photoLoadTrigger.fire();

  const photoLoadTrigger = { fire: () => {} }

  return (
    <div className="contact-edit-form-photo-ctn">
      <ErrorMessage error={error}/>
      <Hover>
        {(hover) => (
          <div className="contact-edit-form-photo">
            <Photo
              photo={contact.photo}
              size={100}
              alt={contact.name}
            />
            {hover && (
              <button
                className="contact-edit-form-upload-photo-btn"
                onClick={handleStartedLoadPhoto}
              >
                <BsCloudUploadFill />
              </button>
            )}
          </div>
        )}
      </Hover>
      <FileChooser
        trigger={photoLoadTrigger}
        onLoadFile={handleLoadPhoto}
        inputRef={inputRef}
        accept="image/png, image/jpeg, image/jpg"
      />
    </div>
  );
}

export default PhotoEditForm;
