import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import SelectableContactPreview from "pages/contacts/import/SelectableContactPreview";
import { useTheme } from "hooks/useTheme";
import { Contact } from "services/contacts";
import { d } from "lib/i18n";
import { font } from "styles";

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
  selected: Contact[];
  select: (contact: Contact) => void;
  unselect: (contact: Contact) => void;
}

const ImportContacts: FC<Props> = ({ contacts, selected, select, unselect }) => {
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
        <SelectableContactPreview
          key={contact.id}
          contact={contact}
          selected={selected.some(c => c.id === contact.id)}
          select={() => select(contact)}
          unselect={() => unselect(contact)}
        />
      ))}
    </Container>
  );
}

export default ImportContacts;
