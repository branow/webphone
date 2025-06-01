import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import TransparentRoundButton from "../../../components/common/button/TransparentRoundButton";
import { useTheme } from "../../../hooks/useTheme";
import { font, size } from "../../../styles";
import { PageSwitcherContext } from "../../../context/PageSwitcherContext";
import { Paths } from "../../../routes";
import { AccountContext } from "../../../context/AccountContext";

const Container = styled.div`
  height: ${size.contact.top.h}px;
  display: flex;
  padding: 0px 15px;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div``;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  width: ${size.contact.top.h * 0.8}px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  edit: () => void;
  remove: () => void;
}

const ContactPageTop: FC<Props> = ({ edit, remove }) => {
  const navigate = useNavigate();
  const { account } = useContext(AccountContext);
  const { previous } = useContext(PageSwitcherContext);

  const back = () => {
    const forms = [Paths.ContactCreate(), Paths.ContactUpdate({ id: ":id" })]
    if (previous && forms.includes(previous.path)) {
      navigate(Paths.Contacts());
    } else {
      navigate(-1);
    }
  }

  const th = useTheme();

  return (
    <Container>
      <Left>
        <TransparentRoundButton
          onClick={() => back()}
          color={th.colors.subtitle}
          colorHover={th.colors.title}
          colorActive={th.colors.text}
        >
          <IconContainer>
            <IoIosArrowBack size={font.size.x3l} />
          </IconContainer>
        </TransparentRoundButton>
      </Left>
      <Right>
        <TransparentRoundButton
          onClick={edit}
          disabled={account?.isDefault}
          color={th.colors.blue}
          colorHover={th.colors.blueHover}
          colorActive={th.colors.blue}
        >
          <IconContainer>
            <MdEdit size={font.size.xl} />
          </IconContainer>
        </TransparentRoundButton>
        <TransparentRoundButton
          onClick={remove}
          disabled={account?.isDefault}
          color={th.colors.red}
          colorHover={th.colors.redHover}
          colorActive={th.colors.red}
        >
          <IconContainer>
            <BsFillTrash3Fill size={font.size.l} />
          </IconContainer>
        </TransparentRoundButton>
      </Right>
    </Container>
  );
}

export default ContactPageTop;
