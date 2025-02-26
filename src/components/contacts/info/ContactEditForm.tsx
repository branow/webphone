import { FC, useState, useContext, ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { BsCloudUploadFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { queryClient } from "../../../App";
import { ContactContext } from "../ContactsPage";
import NumberEditForm from "./NumberEditForm";
import Chapter from "./Chapter";
import Photo from "../../Photo";
import Button from "../../Button";
import FileChooser from "../../FileChooser";
import ErrorMessage from "../../ErrorMessage";
import Hover from "../../Hover";
import TextInput from "../../TextInput";
import TextArea from "../../TextArea";
import PendingTab from "../../PendingTab";
import { ContactQueryKeys, Number, NumberType, SaveContact, saveContact } from "../../../services/contactApi";
import { hex } from "../../../util/identifier";
import "./ContactEditForm.css";

const ContactEditForm: FC = () => {
  const { contact, unsetContact } = useContext(ContactContext)!;
  const [localContact, setLocalContact] = useState<SaveContact>(contact!);
  const [photoError, setPhotoError] = useState<string>("");
  const savingContact = useMutation({
    mutationFn: (contact: SaveContact) => saveContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ContactQueryKeys.CONTACTS]})
    }
  });

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalContact({ ...localContact, name: event.target.value });
  }

  const validateName = (name: string): string => {
    if (!name) return "Name is mandatory";
    if (name.length < 3) return "Too short name";
    if (name.length > 50) return "Too long name";
    return ""
  }

  const validateBio = (bio: string): string => {
    if (bio && bio.length > 250) return "Too long bio";
    return "";
  }
  
  const handleBioChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContact({ ...localContact, bio: event.target.value });
  }

  const setNumber = (newNumber: Number, newNumberIndex: number) => {
    const newNumbers = localContact.numbers.map((number, index) => 
      index === newNumberIndex ? newNumber : number
    )
    setLocalContact({ ...localContact, numbers: newNumbers });
  }

  const handleAddNumber = () => {
    const id = hex(4);
    const newNumber = { id: id, type: NumberType.HOME, number: "" };
    const newNumbers = [...localContact.numbers, newNumber];
    setLocalContact({ ...localContact, numbers: newNumbers})
  }

  const handleDeleteNumber = (numberIndex: number) => {
    const newNumbers = localContact.numbers.filter((_number, index) => index !== numberIndex);
    setLocalContact({ ...localContact, numbers: newNumbers})
  }

  const handleSave = () => {
    savingContact.mutate(localContact);
  }

  const handleCancel = () => {
    unsetContact();
  }

  const photoLoadTrigger = { fire: () => {} }

  const handleLoadPhoto = (file: File) => {
    if (file.size > 1024 * 1024 * 2) { // not bigger then 2 megabytes
      setPhotoError("The chosen photo is too large! Please select a photo smaller then 2 MB.");
      return;
    }
    setLocalContact({ ...localContact, photo: URL.createObjectURL(file)})
  }

  const handleStartedLoadPhoto = () => photoLoadTrigger.fire();

  if (savingContact.isPending) {
    return (<PendingTab text="LOADING" message="Please wait" />)
  }

  return (
    <div className="contact-edit-form">
      <ErrorMessage error={savingContact.isError ? savingContact.error!.message : ""} />
      <Chapter>
        <div className="contact-edit-form-photo-ctn">
          <ErrorMessage error={photoError}/>
          <Hover>
            {(hover) => (
              <div className="contact-edit-form-photo">
                <Photo
                  src={localContact.photo}
                  size="100px"
                  alt={localContact.name}
                />
                {hover && (
                  <Button
                    className="contact-edit-form-upload-photo-btn"
                    Icon={BsCloudUploadFill}
                    onClick={handleStartedLoadPhoto}
                  />
                )}
              </div>
            )}
          </Hover>
          <FileChooser
            trigger={photoLoadTrigger}
            onLoadFile={handleLoadPhoto}
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>
      </Chapter>

      <Chapter title="Name">
        <TextInput
          className="contact-edit-name"
          value={localContact.name}
          onChange={handleNameChange}
          validate={validateName}
        />
      </Chapter>

      <Chapter title="Contact">
        <div className="contact-edit-form-numbers">
          {localContact.numbers.map((number, numberIndex) => (
            <NumberEditForm
              key={number.id}
              number={number}
              setNumber={(newNumber) => setNumber(newNumber, numberIndex)}
              deleteNumber={() => handleDeleteNumber(numberIndex)}
            />
          ))}
          <Button
            className="contact-edit-form-numbers-add-btn"
            Icon={FaPlus}
            onClick={handleAddNumber}
            disabled={localContact.numbers.length >= 10}
          />
        </div>
      </Chapter>

      <Chapter title="Bio">
        <TextArea
          className="contact-edit-bio"
          value={localContact.bio || ""}
          onChange={handleBioChange}
          validate={validateBio}
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
