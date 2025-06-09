import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import ContactForm from "components/contact/form/ContactForm";
import { useSaveContact } from "hooks/useSaveContact";
import ContactApi, { Contact } from "services/contacts";
import { d } from "lib/i18n";

const emptyContact: Contact = {
  id: "",
  user: "",
  name: "",
  numbers: [],
}

interface Props {
  user: string;
}

const CreateContactPageForm: FC<Props> = ({ user }) => {
  const { contact, save, isPending, error } = useSaveContact({
    initContact: emptyContact,
    saveContact: (contact: Contact) => ContactApi.create(user, contact),
  });

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {isPending && (
        <PendingPane
          label={t(d.ui.loading.creating)}
          message={d.ui.loading.wait}
        />
      )}
      {!isPending && (
        <FadeMotion key="contact">
          <ContactForm
            contact={contact}
            save={save}
            savingError={error ?? undefined}
          />
        </FadeMotion>
      )}
    </AnimatePresence>
  );
}

export default CreateContactPageForm;
