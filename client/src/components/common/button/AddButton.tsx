import { FC } from "react";
import { FaPlus } from "react-icons/fa";
import IconButton from "components/common/button/IconButton";
import { useTheme } from "hooks/useTheme";

interface Props {
  action: () => void;
  disabled?: boolean;
  size?: number;
}

const AddButton: FC<Props> = ({ action, disabled, size }) => {
  const th = useTheme();

  return (
    <IconButton
      Icon={FaPlus}
      onClick={action}
      disabled={disabled}
      btnSize={size}
      iconScale={0.7}
      color={th.colors.green}
      colorHover={th.colors.greenHover}
    />
  );
};

export default AddButton;
