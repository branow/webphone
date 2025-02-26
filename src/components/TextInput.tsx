import { FC, useState, useEffect, HTMLAttributes, ChangeEvent } from "react";
import { IconType } from "react-icons";
import ErrorMessage from "./ErrorMessage";
import "./TextInput.css";

interface Props extends HTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  Icon?: IconType;
  name?: string;
  value?: string;
  placeholder?: string;
  validate?: (value: string) => string;
}

const TextInput: FC<Props> = (props) => {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (props.validate) {
      const value = props.value === undefined ? "" : props.value
      setError(props.validate(value))
    }
  }, [props.value])

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(event);
    if (props.validate) {
      setError(props.validate(event.target.value))
    }
  }

  const className =  "text-input-upper-ctn" + (props.className ? " " + props.className : "");

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
      <div className="text-input-lower-ctn">
        {props.Icon && (<props.Icon className="text-input-icon" />)}
        <input
          {...props}
          className="text-input"
          name={props.name}
          value={props.value}
          onChange={handleOnChange}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
};

export default TextInput;
