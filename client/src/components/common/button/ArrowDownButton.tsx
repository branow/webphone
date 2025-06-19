import { FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import IconButton from "components/common/button/IconButton";
import { useTheme } from "hooks/useTheme";

interface Props {
  action: () => void;
  disabled?: boolean;
  size?: number;
}

const ArrowDownButton: FC<Props> = ({ action, disabled, size }) => {
  const th = useTheme();

  return (
    <IconButton
      Icon={IoIosArrowDown}
      onClick={action}
      disabled={disabled}
      btnSize={size}
      iconScale={1}
      color={th.colors.subtitle}
      colorHover={th.colors.title}
    />
  );
};

export default ArrowDownButton;
