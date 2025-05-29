import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import ClickableContactPreview from "../../components/contact/ClickableContactPreview";
import { useTheme } from "../../hooks/useTheme";
import { Contact } from "../../services/contacts";
import { d } from "../../lib/i18n";
import { font } from "../../styles";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NoContactsMessage = styled.div<{ color: string }>`
  padding: 20px;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
  text-align: center;
`;

interface Props {
  contacts: Contact[];
}

const ContactList: FC<Props> = ({ contacts }) => {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Container>
      {contacts.length === 0 && (
        <NoContactsMessage color={th.colors.textDisabled}>
          {t(d.contact.messages.noContacts)}
        </NoContactsMessage>
      )}
      {contacts.map(contact => (
        <ClickableContactPreview key={contact.id} contact={contact} />
      ))}
    </Container>
  );
}

export default ContactList;
