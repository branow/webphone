import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import EditButton from "components/common/button/EditButton";
import ArrowLeftButton from "components/common/button/ArrowLeftButton";
import DeleteButton from "components/common/button/DeleteButton";
import { PageSwitcherContext } from "context/PageSwitcherContext";
import { AccountContext } from "context/AccountContext";
import { font, size } from "styles";
import { Paths } from "routes";

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

interface Props {
  user: string;
  edit: () => void;
  remove: () => void;
}

const ContactPageTop: FC<Props> = ({ user, edit, remove }) => {
  const navigate = useNavigate();
  const { account } = useContext(AccountContext);
  const { previous } = useContext(PageSwitcherContext);

  const back = () => {
    const forms = [
      Paths.ContactCreate({ user: ":user" }),
      Paths.ContactUpdate({ id: ":id" })
    ]
    if (previous && forms.includes(previous.path)) {
      navigate(Paths.Contacts({ user }));
    } else {
      navigate(-1);
    }
  }

  return (
    <Container>
      <Left>
        <ArrowLeftButton
          action={() => back()}
          size={font.size.x4l}
        />
      </Left>
      <Right>
        <EditButton
          action={edit}
          disabled={account?.isDefault}
          size={font.size.x4l}
        />
        <DeleteButton
          action={remove}
          disabled={account?.isDefault}
          size={font.size.x4l}
        />
      </Right>
    </Container>
  );
}

export default ContactPageTop;
