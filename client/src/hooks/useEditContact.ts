import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Number, ContactDetails } from "../services/contacts";
import { d } from "../lib/i18n";
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

export interface ContactError {
  name?: string;
  bio?: string;
  numberList?: string;
  numbers?: string[];
}

interface Props {
  initContact: ContactDetails;
}

export function useEditContact({ initContact } : Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState<EditableContact>(mapEditableContact(initContact));
  const [error, setError] = useState<ContactError>();

  useEffect(() => validate(), [form]);

  const validateName = (name: string): string => validator(name)
      .notBlank(t(d.contact.errors.emptyName))
      .min(3, t(d.contact.errors.shortName, { min: 3 }))
      .max(100, t(d.contact.errors.longName, { max: 100 }))
      .validate();

  const validateBio = (bio: string | undefined) => validator(bio || "")
    .max(500, t(d.contact.errors.longBio, { max: 500 }))
    .validate();

  const validateNumberList = (numbers: EditableNumber[]) => validator(numbers)
    .notEmpty(t(d.contact.errors.emptyNumbers))
    .validate();

  const validateNumber = (number: EditableNumber) => validator(number.number)
    .notBlank(t(d.contact.errors.emptyNumber))
    .max(16, t(d.contact.errors.longNumber))
    .validate();

  const validate = () => {
    const error = {
      name: validateName(form.name),
      bio: validateBio(form.bio),
      numberList: validateNumberList(form.numbers),
      numbers: form.numbers.map(validateNumber),
    };
    const isError = error.name || error.bio || error.numberList || error.numbers.some(n => !!n );
    setError(isError ? error : undefined);
  }

  const updateForm = (updates: Partial<EditableContact>) =>
    setForm(prev => ({ ...prev, ...updates }))

  return {
    error,
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
