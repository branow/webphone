import { FC, MouseEventHandler } from "react";
import { IconType } from "react-icons";

interface Props {
  Icon?: IconType;
  text?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: FC<Props> = ({ Icon, text, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled || false}>
      {Icon && (<Icon />)}
      {text && (<span>{text}</span>)}
    </button>
  );
};

export default Button;
