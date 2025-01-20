import { FC } from "react";
import { IconType } from "react-icons";

interface Props {
  Icon?: IconType;
  text?: string;
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
