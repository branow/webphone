import { FC, useState, HTMLAttributes, ChangeEvent } from "react";
import { IconType } from "react-icons";
import ErrorMessage from "./ErrorMessage";
import "./TextArea.css";

interface Props extends HTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: string;
  Icon?: IconType;
  name?: string;
  value?: string;
  placeholder?: string;
  validate?: (value: string) => string;
}

const TextArea: FC<Props> = (props) => {
  const [error, setError] = useState<string>("");

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) props.onChange(event);
    if (props.validate) {
      setError(props.validate(event.target.value))
    }
  }

  const className =  "text-area-upper-ctn" + (props.className ? " " + props.className : "");

  return (
    <div className={className}>
      {props.label && (
        <label
          className="text-input-label"
          htmlFor={props.name}
        >
            {props.label}
        </label>
      )}
      <ErrorMessage error={error} />
      <div className="text-area-lower-ctn">
        {props.Icon && (<props.Icon className="text-area-icon" />)}
        <textarea
          className="text-area"
          name={props.name}
          value={props.value}
          onChange={handleOnChange}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
};

export default TextArea;
