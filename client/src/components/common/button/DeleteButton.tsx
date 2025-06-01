import { FC } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import TransparentRoundButton from "./TransparentRoundButton";
import { useTheme } from "../../../hooks/useTheme";


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
  }
`;

const InnerContainer = styled.div<{ size: number }>`
  font-size: ${p => p.size}px;
  max-width: ${p => p.size}px;
  max-height: ${p => p.size}px;
`;

interface Props {
  size: number;
  remove: () => void;
  disabled?: boolean;
}

const DeleteButton: FC<Props> = ({ size, remove, disabled }) => {
  const th = useTheme();

  return (
    <TransparentRoundButton
      className={cssButton}
      onClick={remove}
      disabled={disabled}
      color={th.colors.red}
      colorHover={th.colors.redHover}
      style={{ padding: `${size / 2.5}px` }}
    >
      <InnerContainer size={size}>
        <BsFillTrash3Fill size={size} />
      </InnerContainer>
    </TransparentRoundButton>
  );
}

export default DeleteButton;

