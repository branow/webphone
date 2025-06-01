import { FC, useContext, useRef } from "react";
import { styled } from "@linaria/react";
import { useTranslation } from "react-i18next";
import Contacts from "../../components/contact/Contacts";
import InfinitePages from "../../components/common/motion/InfinitePages";
import BackgroundMessage from "../../components/common/messages/BackgroundMessage";
import { AccountContext } from "../../context/AccountContext";
import ContactApi from "../../services/contacts";
import { size } from "../../styles";
import { d } from "../../lib/i18n";

const Container = styled.div`
  height: ${size.phone.h - size.navbar.h - size.tabs.h - size.contacts.top.h}px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
`;

interface Props {
  query: string;
}

const ContactsPageBody: FC<Props> = ({ query }) => {
  const { account } = useContext(AccountContext);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  return (
    <Container ref={scrollRef}>
      {account && (
        <InfinitePages
          scrollRef={scrollRef}
          queryKey={ContactApi.QueryKeys.contacts(query, 25)}
          queryFunc={(page) => ContactApi.getAll(account.user, { query: query, number: page, size: 25 })}
        >
          {contacts => <Contacts contacts={contacts} />}
        </InfinitePages>
      )}
      {!account && (
        <BackgroundMessage text={t(d.account.messages.noAccount)} />
      )}
    </Container>
  )
};

export default ContactsPageBody;
