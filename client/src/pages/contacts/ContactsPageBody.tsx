import { FC, useRef } from "react";
import { styled } from "@linaria/react";
import Contacts from "../../components/contact/Contacts";
import InfinitePages from "../../components/common/motion/InfinitePages";
import ContactApi from "../../services/contacts";
import { size } from "../../styles";

const Container = styled.div`
  height: ${size.phone.h - size.navbar.h - size.tabs.h - size.contacts.top.h}px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
`;

interface Props {
  user: string;
  query: string;
}

const ContactsPageBody: FC<Props> = ({ user, query }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Container ref={scrollRef}>
      <InfinitePages
        scrollRef={scrollRef}
        queryKey={ContactApi.QueryKeys.contacts(user, query, 25)}
        queryFunc={(page) => ContactApi.getAll(user, { query: query, number: page, size: 25 })}
      >
        {contacts => <Contacts contacts={contacts} />}
      </InfinitePages>
    </Container>
  );
};

export default ContactsPageBody;
