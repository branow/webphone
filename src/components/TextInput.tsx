import { FC } from "react";
import { IconType } from "react-icons";

interface Props {
  className?: string;
  label?: string;
  Icon?: IconType;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const TextInput: FC<Props> = ({ className, Icon, label, name, value, placeholder, onChange }) => {
  return (
    <div className={className}>
      {label && (<label htmlFor={name}>{label}</label>)}
      <div>
        {Icon && (<Icon className="text-input-icon" />)}
        <input
          className={className}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextInput;
