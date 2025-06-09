import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { styled } from "@linaria/react";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import ErrorBanner from "components/common/messages/ErrorBanner";
import DeleteContactWindow from "pages/contact/view/DeleteContactWindow";
import ContactPageTop from "pages/contact/view/ContactPageTop";
import ContactPageBody from "pages/contact/view/ContactPageBody";
import ContactApi, { Contact } from "services/contacts";
import HistoryApi from "services/history";
import { d } from "lib/i18n";
import { Paths } from "routes";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

interface Props {
  contact: Contact;
}

const ContactPageContent: FC<Props> = ({ contact }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const edit = () => navigate(Paths.ContactUpdate({ id: contact.id }));

  const [isRemoving, setIsRemoving] = useState(false);
  const queryClient = useQueryClient();

  const removing = useMutation({
    mutationFn: () => ContactApi.remove(contact.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: ContactApi.QueryKeys.predicate });
      queryClient.invalidateQueries({ predicate: HistoryApi.QueryKeys.predicate });
      navigate(Paths.Contacts({ user: contact.user }));
    }
  });

  const remove = () => {
    removing.mutate();
    setIsRemoving(false);
  };

  return (
    <Container>
      <ContactPageTop
        user={contact.user}
        edit={edit}
        remove={() => setIsRemoving(true)}
      />
      <AnimatePresence>
        {!removing.isPending && (
          <FadeMotion>
            <ErrorBanner error={removing.error} />
            <ContactPageBody contact={contact} />
          </FadeMotion>
        )}
        {removing.isPending && (
          <PendingPane
            label={t(d.ui.loading.deleting)}
            message={t(d.ui.loading.wait)}
          />
        )}
      </AnimatePresence>
      {isRemoving && (
        <DeleteContactWindow
          contactName={contact.name}
          close={() => setIsRemoving(false)}
          deleteContact={remove}
        />
      )}
    </Container>
  );
}

export default ContactPageContent;
