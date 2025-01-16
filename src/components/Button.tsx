import { FC, MouseEventHandler } from "react";
import { IconType } from "react-icons";

interface Props {
  Icon?: IconType;
  text?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<Props> = ({ Icon, text, onClick }) => {
  return (
    <button onClick={onClick}>
      {Icon && (<Icon />)}
      {text && (<span>{text}</span>)}
    </button>
  );
};

export default Button;
