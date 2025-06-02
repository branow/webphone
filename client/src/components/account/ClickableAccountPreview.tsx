import { FC } from "react";
import { useNavigate } from "react-router";
import { css } from "@linaria/core";
import TransparentClickableContainer from "../common/button/TransparentClickableContainer";
import AccountPreview from "./AccountPreview";
import { Account } from "../../services/accounts";
import { Paths } from "../../routes";

const style = css`
  border-radius: 10px;
`;

interface Props {
  account: Account,
  onClick?: () => void,
}

const ClickableContactPreview: FC<Props> = ({ account, onClick }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (onClick) { 
      onClick();
    } else {
      navigate(Paths.AccountView({ id: account.id }));
    }
  }

  return (
    <TransparentClickableContainer className={style} onClick={handleOnClick}>
      <AccountPreview account={account} />
    </TransparentClickableContainer>
  );
}

export default ClickableContactPreview;
