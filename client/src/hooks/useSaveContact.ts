import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ContactApi, { ContactDetails } from "../services/contacts";
import PhotoApi from "../services/photos";

interface Props {
  initContact: ContactDetails;
  saveFunc: (contact: ContactDetails) => Promise<ContactDetails>
}

export function useSaveContact({ initContact, saveFunc }: Props) {
  const [contact, setContact] = useState<ContactDetails>(initContact);
  const [photo, loadPhoto] = useState<File>();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const savingContact = useMutation({
    mutationFn: async (contact: ContactDetails) => {
      setContact(contact);
      if (photo) {
        contact.photo = (await PhotoApi.upload(photo)).id;
      }
      await saveFunc(contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: ContactApi.QueryKeys.predicate });
      navigate('/contacts');
    }
  });

  const save = (contact: ContactDetails) => savingContact.mutate(contact);

  const cancel = () => navigate("/contacts");
 
  return {
    contact,
    loadPhoto,
    save,
    cancel,
    isPending: savingContact.isPending,
    error: savingContact.error,
  }
}
