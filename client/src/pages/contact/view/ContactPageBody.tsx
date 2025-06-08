import { FC, useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import Photo from "../../../components/contact/photo/Photo";
import Chapter from "../../../components/common/pane/Chapter";
import ChapterBar from "../../../components/common/pane/ChapterBar";
import ContactNumbers from "../../../components/contact/ContactNumbers";
import InfinitePages from "../../../components/common/motion/InfinitePages";
import CallRecords from "../../../components/history/CallRecords";
import { useTheme } from "../../../hooks/useTheme";
import { ContactDetails } from "../../../services/contacts";
import HistoryApi from "../../../services/history";
import { d } from "../../../lib/i18n";
import { font, size } from "../../../styles";
import { Paths } from "../../../routes";
import { AccountContext } from "../../../context/AccountContext";

const Container = styled.div`
  overflow-y: auto;
  height: ${size.phone.h - size.navbar.h - size.contact.top.h}px;
  padding: 0px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Name = styled.div<{ color: string }>`
  text-align: center;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
`;


interface Props {
  contact: ContactDetails;
}

const ContactPageBody: FC<Props> = ({ contact }) => {
  const navigate = useNavigate();

  const call = (number: string) => navigate(Paths.Call({ number: number }));

  const th = useTheme();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Container ref={scrollRef}>
      <Chapter>
        <Header>
          <Photo src={contact.photo} size={100} alt={contact.name} />
          <Name color={th.colors.text}>{contact.name}</Name>
        </Header>
      </Chapter>
      {contact.bio && (
        <>
          <Chapter title={t(d.contact.fields.bio)}>
            {contact.bio}
          </Chapter>
          <ChapterBar />
        </>
      )}
      <Chapter title={t(d.contact.fields.contact)}>
        <ContactNumbers numbers={contact.numbers} call={call} fontSize={font.size.m} />
      </Chapter>
      <ChapterBar />
      <Chapter title={t(d.contact.fields.history)}>
        <InfinitePages
          scrollRef={scrollRef}
          queryKey={HistoryApi.QueryKeys.historyByContact(contact.id, 30)}
          queryFunc={(page) => HistoryApi.getAllByContact(contact.user, contact.id, { number: page, size: 30 })}
        >
          {(records) => <CallRecords records={records} />}
        </InfinitePages>
      </Chapter>
    </Container>
  );
}

export default ContactPageBody;
