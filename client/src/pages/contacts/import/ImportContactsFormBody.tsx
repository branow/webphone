import { FC, useRef } from "react";
import { styled } from "@linaria/react";
import InfinitePages from "components/common/motion/InfinitePages";
import ErrorBanner from "components/common/messages/ErrorBanner";
import ImportContacts from "pages/contacts/import/ImportContacts";
import ContactApi, { Contact } from "services/contacts";
import { size } from "styles";

const Container = styled.div`
  height: ${size.phone.h - size.navbar.h - size.tabs.h - size.import.top.h}px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
`;

interface Props {
  error: Error | null;
  user: string;
  query: string;
  selected: Contact[];
  select: (contact: Contact) => void;
  unselect: (contact: Contact) => void;
}

const ImportContactsFormBody: FC<Props> = ({ error, user, query, selected, select, unselect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Container ref={scrollRef}>
      <InfinitePages
        scrollRef={scrollRef}
        queryKey={ContactApi.QueryKeys.contacts(user, query, 25)}
        queryFunc={(page) => ContactApi.getAll(user, { query: query, number: page, size: 25 })}
      >
        {contacts => (
          <>
            {error && <ErrorBanner error={error} />}
            <ImportContacts
              contacts={contacts}
              selected={selected}
              select={select}
              unselect={unselect}
            />
          </>
        )}
      </InfinitePages>
    </Container>
  );
};



export default ImportContactsFormBody;
