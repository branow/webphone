import { FC, ChangeEvent, FocusEvent } from "react";
import { IconType } from "react-icons";
import ErrorMessage from "./ErrorMessage";
import "./TextInput.css";

interface Props {
  onValueChange: (value: string) => void;
  className?: string;
  label?: string;
  Icon?: IconType;
  error?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

const TextInput: FC<Props> = (
  { className, label, Icon, error, name, value, placeholder, onChange, onBlur, onValueChange }
) => {

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event);
    onValueChange(event.target.value);
  }

  const fullClassName =  "text-input-upper-ctn" + (className ? " " + className : "");

  return (
    <div className={fullClassName}>
      {label && (
        <label
          className="text-input-label"
          htmlFor={name}
        >
            {label}
        </label>
      )}
      <ErrorMessage error={error} />
      <div className="text-input-lower-ctn">
        {Icon && (<Icon className="text-input-icon" />)}
        <input
          className="text-input"
          name={name}
          value={value}
          onChange={handleOnChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextInput;
