import { FC } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import NotFoundPage from "../../errors/NotFoundPage";
import ContactEditForm from "./ContactEditForm";
import ContactApi, { ContactDetails } from "../../../services/contacts";
import { useSaveContact } from "../../../hooks/useSaveContact";
import { d } from "../../../lib/i18n";

const ContactUpdatePage: FC = () => {
  const params = useParams<{ id: string }>();
  const contactId: string = params.id || "";

  if (!contactId) {
    return <NotFoundPage />
  }

  return (
    <ContactUpdateFetchingPage contactId={contactId} />
  );
};

export default ContactUpdatePage;

const ContactUpdateFetchingPage: FC<{ contactId: string }> = ({ contactId }) => {
  const { t } = useTranslation();
  const { data, isError, error, isPending } = useQuery({
    queryKey: ContactApi.QueryKeys.contact(contactId),
    queryFn: () => ContactApi.get(contactId),
  });

  if (isError) {
    return <ErrorMessage error={error}/>;
  }

  if (isPending) {
    return <PendingTab text={t(d.ui.loading.loading)} message={d.ui.loading.wait} />;
  }

  return (
    <ContactUpdateSavingPage
      initContact={data}
    />
  );
};

const ContactUpdateSavingPage: FC<{ initContact: ContactDetails }> = ({ initContact }) => {
  const { t } = useTranslation();
  const { contact, isPending, loadPhoto, save, cancel, error } = useSaveContact({
    initContact: initContact,
    saveFunc: (contact: ContactDetails) => ContactApi.update({ ...contact }),
  });

  if (isPending) {
    return <PendingTab text={t(d.ui.loading.updating)} message={d.ui.loading.wait} />;
  }

  return (
    <ContactEditForm
      contact={contact}
      loadPhoto={loadPhoto}
      save={save}
      cancel={cancel}
      savingError={error?.message}
    />
  );
};

