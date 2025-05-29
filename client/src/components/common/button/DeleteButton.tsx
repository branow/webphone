import { FC } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import TransparentRoundButton from "./TransparentRoundButton";
import { useTheme } from "../../../hooks/useTheme";

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteButtonContainer = styled.div<{ size: number, color: string, colorHover: string, }>`
  & svg {
    font-size: ${p => p.size}px;
    max-width: ${p => p.size}px;
    max-height: ${p => p.size}px;
    color: ${p => p.color};
    transition: all ease-in-out 0.15s;
  }

  &:hover svg {
    color: ${p => p.colorHover};
  }

  &:active svg {
    color: ${p => p.color};
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

interface Props {
  size: number;
  remove: () => void;
  disabled?: boolean;
}

const DeleteButton: FC<Props> = ({ size, remove, disabled }) => {
  const th = useTheme();

  return (
    <DeleteButtonContainer size={size} color={th.colors.red} colorHover={th.colors.redHover}>
      <TransparentRoundButton
        className={container}
        onClick={remove}
        disabled={disabled}
        style={{ padding: `${size / 2.5}px` }}
      >
        <BsFillTrash3Fill size={size} />
      </TransparentRoundButton>
    </DeleteButtonContainer>
  );
}

export default DeleteButton;

