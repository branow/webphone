import { FC } from "react";
import { FaMinus } from "react-icons/fa";
import IconButton from "components/common/button/IconButton";
import { useTheme } from "hooks/useTheme";

interface Props {
  unselect: () => void;
  disabled?: boolean;
  size?: number;
}

const UnselectButton: FC<Props> = ({ unselect, disabled, size }) => {
  const th = useTheme();

  return (
    <IconButton
      Icon={FaMinus}
      onClick={unselect}
      disabled={disabled}
      btnSize={size}
      iconScale={0.7}
      color={th.colors.blue}
      colorHover={th.colors.blueHover}
    />
  );
};

export default UnselectButton;
