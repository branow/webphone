import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import ImportContactsForm from "pages/contacts/import/ImportContactsForm";
import { useCreateContactsBatch } from "hooks/fetch";
import { Contact } from "services/contacts";
import { d } from "lib/i18n";

interface Props {
  srcUser: string;
  targetUser: string;
}

const ImportContactsPageForm: FC<Props> = ({ srcUser, targetUser }) => {
  const { create, isPending, error } = useCreateContactsBatch({ user: targetUser });
  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {isPending && (
        <PendingPane
          label={t(d.ui.loading.importing)}
          message={d.ui.loading.wait}
        />
      )}
      {!isPending && (
        <FadeMotion key="contact">
          <ImportContactsForm
            user={srcUser}
            create={(contacts: Contact[]) => { create(contacts); }}
            error={error}
          />
        </FadeMotion>
      )}
    </AnimatePresence>
  );
};

export default ImportContactsPageForm;
