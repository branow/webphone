import { FC } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { css } from "@linaria/core";
import TransparentRoundButton from "components/common/button/TransparentRoundButton";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";
import { styled } from "@linaria/react";


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

const IconContainer = styled.div<{ size: number }>`
  width: ${p => p.size}px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  remove: () => void;
  btnSize?: number;
  iconSize?: number;
  disabled?: boolean;
}

const DeleteButton: FC<Props> = ({ remove, btnSize, iconSize, disabled }) => {
  const th = useTheme();

  iconSize = iconSize || font.size.xl;
  btnSize = btnSize || iconSize * 1.75;

  return (
    <TransparentRoundButton
      className={cssButton}
      onClick={remove}
      disabled={disabled}
      color={th.colors.red}
      colorHover={th.colors.redHover}
    >
      <IconContainer size={btnSize}>
        <BsFillTrash3Fill size={iconSize} />
      </IconContainer>
    </TransparentRoundButton>
  );
}

export default DeleteButton;

