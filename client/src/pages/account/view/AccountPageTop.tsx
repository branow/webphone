import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import { IoIosArrowBack } from "react-icons/io";
import TransparentRoundButton from "../../../components/common/button/TransparentRoundButton";
import { useTheme } from "../../../hooks/useTheme";
import { font, size } from "../../../styles";
import { PageSwitcherContext } from "../../../context/PageSwitcherContext";
import { Paths } from "../../../routes";
import EditButton from "../../../components/common/button/EditButton";
import DeleteButton from "../../../components/common/button/DeleteButton";

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

const AccountPageTop: FC<Props> = ({ edit, remove }) => {
  const navigate = useNavigate();
  const { previous } = useContext(PageSwitcherContext);

  const back = () => {
    const forms = [Paths.AccountCreate(), Paths.AccountUpdate({ id: ":id" })]
    if (previous && forms.includes(previous.path)) {
      navigate(Paths.Accounts());
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
        <EditButton
          edit={edit}
          btnSize={size.account.top.h * 0.8}
          iconSize={font.size.xl}
        />
        <DeleteButton
          remove={remove}
          btnSize={size.account.top.h * 0.8}
          iconSize={font.size.xl}
        />
      </Right>
    </Container>
  );
}

export default AccountPageTop;
