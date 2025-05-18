import { useState, useEffect } from "react";
import { Number, ContactDetails } from "../services/contacts";
import { hex } from "../util/identifier";
import { validator } from "../util/validator";

export type EditableNumber = Number & { id: string };

export type EditableContact = {
  id: string;
  name: string;
  photo?: string;
  bio?: string;
  numbers: EditableNumber[]
};

interface ContactError {
  save?: string;
  name?: string;
  bio?: string;
  numberList?: string;
  numbers?: string[];
}

interface Props {
  contact: ContactDetails;
}

export function useContactEditForm({ contact } : Props) {
  const [form, setForm] = useState<EditableContact>(mapEditableContact(contact));
  const [error, setError] = useState<ContactError>({ });

  useEffect(() => validate(), [form]);

  const validateName = (name: string): string => validator(name)
      .notBlank("Name is mandatory")
      .min(3, "Too short name")
      .max(50, "Too long name")
      .validate();

  const validateBio = (bio: string | undefined) => validator(bio || "")
    .max(250, "Too long bio")
    .validate();

  const validateNumberList = (numbers: EditableNumber[]) => validator(numbers)
    .notEmpty("Contact must have at least one number")
    .validate();

  const validateNumber = (number: EditableNumber) => validator(number.number)
    .notBlank("Number is mandatory")
    .max(16, "Number is too long")
    .validate();

  const validate = () => {
    updateError({
      name: validateName(form.name),
      bio: validateBio(form.bio),
      numberList: validateNumberList(form.numbers),
      numbers: form.numbers.map(validateNumber),
    });
  }

  const updateForm = (updates: Partial<EditableContact>) =>
    setForm(prev => ({ ...prev, ...updates }))

  const updateError = (updates: Partial<ContactError>) =>
    setError(prev => ({ ...prev, ...updates }))

  return {
    error,
    updateError,
    form,
    updateForm,
  };
}

function mapEditableContact(contact: ContactDetails): EditableContact {
  return { ...contact, numbers: contact.numbers.map(mapEditableNumber) };
}

function mapEditableNumber(number: Number): EditableNumber {
  return { ...number, id: hex(4) };
}
