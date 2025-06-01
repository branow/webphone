import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "../../../components/common/motion/FadeMotion";
import PendingPane from "../../../components/common/motion/PendingPane";
import ContactForm from "../../../components/contact/form/ContactForm";
import { AccountContext } from "../../../context/AccountContext";
import { useSaveContact } from "../../../hooks/useSaveContact";
import ContactApi, { ContactDetails } from "../../../services/contacts";
import { d } from "../../../lib/i18n";

const emptyContact: ContactDetails = {
  id: "",
  name: "",
  numbers: [],
}

const CreateContactPage: FC = () => {
  const { user } = useContext(AccountContext);
  const { contact, save, isPending, error } = useSaveContact({
    initContact: emptyContact,
    saveContact: (contact: ContactDetails) => ContactApi.create(user, contact),
  });

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {isPending && (
        <PendingPane
          label={t(d.ui.loading.updating)}
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

export default CreateContactPage;
