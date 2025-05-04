import { FC, ChangeEvent } from "react";
import TextArea from "../../../components/TextArea";
import "./ContactEditForm.css";

interface Props {
  bio?: string;
  setBio: (bio: string) => void;
}

const BioEditForm: FC<Props> = ({ bio, setBio }) => {

  const handleBioChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  }

  const validateBio = (bio: string): string => {
    if (bio && bio.length > 250) return "Too long bio";
    return "";
  }

  return (
    <TextArea
      className="contact-edit-bio"
      value={bio || ""}
      onChange={handleBioChange}
      validate={validateBio}
    />
  );
}

export default BioEditForm;
