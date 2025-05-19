import { FC, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BsCloudUploadFill } from "react-icons/bs";
import Photo from "../../../components/Photo";
import FileChooser from "../../../components/FileChooser";
import ErrorMessage from "../../../components/ErrorMessage";
import Hover from "../../../components/Hover";
import "./ContactEditForm.css";
import { EditableContact } from "../../../hooks/useContactEditForm";
import { d } from "../../../lib/i18n";

interface Props {
  contact: EditableContact;
  setPhoto: (url: string) => void;
  loadPhoto: (photo: File) => void;
}

const PhotoEditForm: FC<Props> = ({ contact, loadPhoto, setPhoto }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const handleLoadPhoto = (file: File) => {
    if (file.size > 1024 * 1024 * 8) { // not bigger then 8 megabytes
      setError(t(d.contact.errors.largePhoto, { max: 8 }));
      return;
    }
    setPhoto(URL.createObjectURL(file));
    loadPhoto(file);
  }

  const handleStartedLoadPhoto = () => inputRef.current?.click();

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
        onLoadFile={handleLoadPhoto}
        inputRef={inputRef}
        accept="image/png, image/jpeg, image/jpg"
      />
    </div>
  );
}

export default PhotoEditForm;
