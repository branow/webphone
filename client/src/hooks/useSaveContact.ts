import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ContactApi, { ContactDetails } from "services/contacts";
import PhotoApi from "services/photos";
import { Paths } from "routes";

interface Props {
  initContact: ContactDetails;
  saveContact: (contact: ContactDetails) => Promise<ContactDetails>
}

interface SaveContact {
  contact: ContactDetails;
  photo?: File;
}

export function useSaveContact({ initContact, saveContact }: Props) {
  const [contact, setContact] = useState<ContactDetails>(initContact);

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

  const save = (contact: ContactDetails, photo?: File) => {
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
