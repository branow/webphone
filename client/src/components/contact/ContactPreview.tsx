import { FC } from "react";
import { styled } from "@linaria/react";
import Photo from "components/contact/photo/Photo";
import ContactNumbers from "components/contact/ContactNumbers";
import { useTheme } from "hooks/useTheme";
import { Contact } from "services/contacts";

const Container = styled.div`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Info = styled.div`
  width: 170px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Name = styled.div<{ color: string }>`
  font-size: 16px;
  text-align: center;
`

interface Props {
  contact: Contact,
  onClick?: () => void,
}

const ContactPreview: FC<Props> = ({ contact }) => {
  const th = useTheme();

  return (
    <Container>
      <Photo src={contact.photo} size={60} alt={`${contact.name}'s photo`} />
      <Info>
        <Name color={th.colors.text}>{contact.name}</Name>
        <ContactNumbers numbers={contact.numbers} />
      </Info>
    </Container>
  );
}

export default ContactPreview;
