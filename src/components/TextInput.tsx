import { FC } from "react";
import { IconType } from "react-icons";

interface Props {
  className?: string;
  label?: string;
  Icon?: IconType;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const TextInput: FC<Props> = ({ className, Icon, label, name, value, onChange }) => {
  return (
    <div>
      {label && (<label htmlFor={name}>{label}</label>)}
      <div>
        {Icon && (<Icon />)}
        <input
          className={className}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TextInput;
