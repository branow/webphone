import { FC, ChangeEvent } from "react";
import TextInput from "../../../components/TextInput";
import "./ContactEditForm.css";

interface Props {
  name: string;
  setName: (name: string) => void; 
}

const NameEditForm: FC<Props> = ({ name, setName }) => {

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const validateName = (name: string): string => {
    if (!name) return "Name is mandatory";
    if (name.length < 3) return "Too short name";
    if (name.length > 50) return "Too long name";
    return ""
  }

  return (
    <TextInput
      className="contact-edit-name"
      value={name}
      onChange={handleNameChange}
      validate={validateName}
    />
  );
}

export default NameEditForm;
