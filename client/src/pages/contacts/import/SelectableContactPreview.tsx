import { FC } from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import TransparentClickableContainer from "components/common/button/TransparentClickableContainer";
import ContactPreview from "components/contact/ContactPreview";
import CheckBox from "components/common/input/CheckBox";
import { Contact } from "services/contacts";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const cssContainer = css`
  position: relative;
  border-radius: 10px;
`;

const CheckBoxContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
`;

interface Props {
  contact: Contact;
  selected: boolean;
  select: () => void;
  unselect: () => void;
}

const SelectableContactPreview: FC<Props> = ({ contact, selected, select, unselect }) => {
  const handleSelection = () => selected ? unselect() : select();

  const th = useTheme();

  return (
    <TransparentClickableContainer
      className={cssContainer}
      onClick={handleSelection}
      style={{ borderLeft: `8px solid ${selected ? th.colors.yellow : th.colors.bgDisabled}` }}
    >
      <CheckBoxContainer>
        <CheckBox size={font.size.m} checked={selected} />
      </CheckBoxContainer>
      <ContactPreview contact={contact} />
    </TransparentClickableContainer>
  );
}

export default SelectableContactPreview;
