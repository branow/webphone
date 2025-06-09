import { FC } from "react";
import { BiImport } from "react-icons/bi";
import IconButton from "components/common/button/IconButton";
import { useTheme } from "hooks/useTheme";

interface Props {
  action: () => void;
  disabled?: boolean;
  size?: number;
}

const ImportButton: FC<Props> = ({ action, disabled, size }) => {
  const th = useTheme();

  return (
    <IconButton 
      Icon={BiImport}
      onClick={action}
      disabled={disabled}
      btnSize={size}
      iconScale={0.9}
      color={th.colors.green}
      colorHover={th.colors.greenHover}
    />
  );
};

export default ImportButton;
