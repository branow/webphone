import { FC, HTMLAttributes } from "react";
import { IconType } from "react-icons";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  Icon?: IconType;
  text?: string;
  disabled?: boolean;
}

const Button: FC<Props> = (props) => {
  return (
    <button {...props}>
      {props.Icon && (<props.Icon />)}
      {props.text && (<span>{props.text}</span>)}
    </button>
  );
};

export default Button;

