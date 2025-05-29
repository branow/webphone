import { FC } from "react";
import { useNavigate } from "react-router";
import { css } from "@linaria/core";
import TransparentClickableContainer from "../common/button/TransparentClickableContainer";
import ContactPreview from "./ContactPreview";
import { Contact } from "../../services/contacts";
import { Paths } from "../../routes";

const style = css`
  border-radius: 10px;
`;

interface Props {
  contact: Contact,
  onClick?: () => void,
}

const ClickableContactPreview: FC<Props> = ({ contact, onClick }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (onClick) { 
      onClick();
    } else {
      navigate(Paths.ContactView({ id: contact.id }));
    }
  }

  return (
    <TransparentClickableContainer className={style} onClick={handleOnClick}>
      <ContactPreview contact={contact} />
    </TransparentClickableContainer>
  );
}

export default ClickableContactPreview;
