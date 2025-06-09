import { FC } from "react";
import { IconType } from "react-icons/lib";
import { styled } from "@linaria/react";
import TransparentRoundButton from "components/common/button/TransparentRoundButton";
import { useTheme } from "hooks/useTheme";
import { css, cx } from "@linaria/core";

const cssButton = css`
  width: fit-content;
  height: fit-content;
  box-sizing: border-box;
`;

const IconContainer = styled.div<{ size: number }>`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  Icon: IconType;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  color?: string;
  colorHover?: string;
  btnSize?: number;
  iconScale?: number;
}

const IconButton: FC<Props> = ({
  className,
  onClick,
  Icon,
  color,
  colorHover,
  disabled,
  btnSize,
  iconScale,
}) => {

  btnSize = btnSize || 40;
  iconScale = iconScale || 0.7;
  const iconSize = btnSize * iconScale;

  const th = useTheme();

  return (
    <TransparentRoundButton
      className={cx(cssButton, className)}
      onClick={onClick}
      disabled={disabled}
      color={color || th.colors.blue}
      colorHover={colorHover || th.colors.blueHover}
      colorActive={color || th.colors.blue}
    >
      <IconContainer size={btnSize}>
        <Icon size={iconSize} />
      </IconContainer>
    </TransparentRoundButton>
  );
};

export default IconButton;
