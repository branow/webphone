import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "../../../components/common/motion/FadeMotion";
import PendingPane from "../../../components/common/motion/PendingPane";
import ContactForm from "../../../components/contact/form/ContactForm";
import ContactApi, { ContactDetails } from "../../../services/contacts";
import { useSaveContact } from "../../../hooks/useSaveContact";
import { d } from "../../../lib/i18n";

const UpdateContactFormPage: FC<{ initContact: ContactDetails }> = ({ initContact }) => {
  const { contact, save, isPending, error } = useSaveContact({
    initContact: initContact,
    saveContact: (contact: ContactDetails) => ContactApi.update({ ...contact }),
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
};

export default UpdateContactFormPage;

