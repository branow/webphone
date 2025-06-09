import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ContactApi, { Contact } from "services/contacts";
import PhotoApi from "services/photos";
import { Paths } from "routes";

interface Props {
  initContact: Contact;
  saveContact: (contact: Contact) => Promise<Contact>
}

interface SaveContact {
  contact: Contact;
  photo?: File;
}

export function useSaveContact({ initContact, saveContact }: Props) {
  const [contact, setContact] = useState(initContact);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { error, isPending, mutate } = useMutation({
    mutationFn: async ({ contact, photo }: SaveContact) => {
      const contactCopy = { ...contact };

      if (photo) {
        const uploaded = await PhotoApi.upload(photo);
        contactCopy.photo = uploaded.id;
      }

      const saved = await saveContact(contactCopy);
      return saved;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ predicate: ContactApi.QueryKeys.predicate });
      navigate(Paths.ContactView({ id: data.id }));
      setContact(data);
    }
  });

  const save = (contact: Contact, photo?: File) => {
    setContact({ ...contact });
    mutate({ contact, photo });
  };
 
  return {
    contact,
    save,
    isPending,
    error,
  }
}
