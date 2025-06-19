import { FC } from "react";
import { useNavigate } from "react-router";
import { css } from "@linaria/core";
import TransparentClickableContainer from "components/common/button/TransparentClickableContainer";
import CallPreview from "./CallPreview";
import { Paths } from "routes";
import { Call } from "lib/sip";

const style = css`
  border-radius: 10px;
`;

interface Props {
  call: Call,
}

const ClickableCallPreview: FC<Props> = ({ call }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(Paths.CallActive({ id: call.id }));
  }

  return (
    <TransparentClickableContainer className={style} onClick={handleOnClick}>
      <CallPreview call={call} />
    </TransparentClickableContainer>
  );
}

export default ClickableCallPreview;
