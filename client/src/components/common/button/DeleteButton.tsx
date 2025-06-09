import { FC } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { css } from "@linaria/core";
import IconButton from "components/common/button/IconButton";
import { useTheme } from "hooks/useTheme";


const cssButton = css`
  &:not(:disabled):active {
    animation: rotate 0.1s ease-in-out 0s 2;
  }

  @keyframes rotate {
    from {
      transform: rotate(-5deg);
    }
    to {
      transform: rotate(5deg);
    }
`;

interface Props {
  action: () => void;
  disabled?: boolean;
  size?: number;
}

const DeleteButton: FC<Props> = ({ action, size, disabled }) => {
  const th = useTheme();

  return (
    <IconButton
      className={cssButton}
      Icon={BsFillTrash3Fill}
      onClick={action}
      disabled={disabled}
      btnSize={size}
      iconScale={0.7}
      color={th.colors.red}
      colorHover={th.colors.redHover}
    />
  );
}

export default DeleteButton;

