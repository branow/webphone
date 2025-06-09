import { FC } from "react";
import { MdEdit } from "react-icons/md";
import IconButton from "components/common/button/IconButton";

interface Props {
  action: () => void;
  disabled?: boolean;
  size?: number;
}

const EditButton: FC<Props> = ({ action, disabled, size }) => {
  return (
    <IconButton
      Icon={MdEdit}
      onClick={action}
      disabled={disabled}
      btnSize={size}
      iconScale={0.8}
    />
  );
};

export default EditButton;
