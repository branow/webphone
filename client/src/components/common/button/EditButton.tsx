import { FC } from "react";
import { styled } from "@linaria/react";
import { MdEdit } from "react-icons/md";
import TransparentRoundButton from "components/common/button/TransparentRoundButton";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const IconContainer = styled.div<{ size: number }>`
  width: ${p => p.size}px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  edit: () => void;
  disabled?: boolean;
  btnSize?: number;
  iconSize?: number;
}

const EditButton: FC<Props> = ({ edit, disabled, iconSize, btnSize }) => {
  const th = useTheme();

  iconSize = iconSize || font.size.xl;
  btnSize = btnSize || iconSize * 1.75;

  return (
    <TransparentRoundButton
      onClick={edit}
      disabled={disabled}
      color={th.colors.blue}
      colorHover={th.colors.blueHover}
      colorActive={th.colors.blue}
    >
      <IconContainer size={btnSize}>
        <MdEdit size={font.size.xl} />
      </IconContainer>
    </TransparentRoundButton>
  );
};

export default EditButton;
