import { FC, useState } from "react";
import { styled } from "@linaria/react";
import ImportContactsFormBody from "pages/contacts/import/ImportContactsFormBody";
import ImportContactsFormBottom from "pages/contacts/import/ImportContactsFormBottom";
import ImportContactsFormTop from "pages/contacts/import/ImportContactsFormTop";
import { Contact } from "services/contacts";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

interface Props {
  user: string;
  create: (contacts: Contact[]) => void;
  error: Error | null;
}

const ImportContactsForm: FC<Props> = ({ user, create, error }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Contact[]>([]);

  const select = (contact: Contact) => setSelected([ ...selected, contact ]);
  const unselect = (contact: Contact) => setSelected(selected.filter(c => c.id !== contact.id));
  const unselectAll = () => setSelected([]);

  return (
    <Container>
      <ImportContactsFormTop
        setQuery={setQuery}
        unselect={unselectAll}
      />
      <ImportContactsFormBody
        error={error}
        user={user}
        query={query}
        selected={selected}
        select={select}
        unselect={unselect}
      />
      <ImportContactsFormBottom
        create={() => create(selected)}
        disabled={selected.length === 0}
      />
    </Container>
  );
};

export default ImportContactsForm;
