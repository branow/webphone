import { FC, ChangeEvent } from "react";
import { IconType } from "react-icons";
import ErrorMessage from "./ErrorMessage";
import "./TextArea.css";

interface Props {
  onValueChange: (value: string) => void;
  className?: string;
  label?: string;
  Icon?: IconType;
  error? : string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: FC<Props> = ({ className, label, Icon, error, name, value, placeholder, onChange, onValueChange }) => {

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(event);
    onValueChange(event.target.value);
  }

  const fillClassName =  "text-area-upper-ctn" + (className ? " " + className : "");

  return (
    <div className={fillClassName}>
      {label && (
        <label
          className="text-input-label"
          htmlFor={name}
        >
            {label}
        </label>
      )}
      <ErrorMessage error={error} />
      <div className="text-area-lower-ctn">
        {Icon && (<Icon className="text-area-icon" />)}
        <textarea
          className="text-area"
          name={name}
          value={value}
          onChange={handleOnChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextArea;
