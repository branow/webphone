import { FC, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import ErrorMessage from "components/common/messages/ErrorMessage";
import FileInput from "components/common/input/FileInput";
import PhotoInput from "components/contact/form/PhotoInput";
import { EditableContact } from "hooks/useEditContact";
import { d } from "lib/i18n";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  contact: EditableContact;
  setPhoto: (photo: File | undefined) => void;
}

const PhotoForm: FC<Props> = ({ contact, setPhoto }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    if (file.size > 1024 * 1024 * 8) {
      setError(t(d.contact.errors.largePhoto, { max: 8 }));
      return;
    }
    setPhoto(file);
  }

  const choose = () => inputRef.current?.click();
  
  const remove = () => setPhoto(undefined);

  return (
    <Container>
      <FileInput
        onFiles={handleFiles}
        inputRef={inputRef}
        accept="image/png, image/jpeg, image/jpg"
      />
      <PhotoInput src={contact.photo} remove={remove} choose={choose} />
      <ErrorMessage error={error}/>
    </Container>
  );
};


export default PhotoForm;

