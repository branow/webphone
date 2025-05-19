import { ReactNode, useState } from "react";
import Option from "./Option";
import "./Select.css";

interface SelectProps<T> {
  options: T[];
  render: (t: T) => ReactNode;
  getKey: (t: T) => string | number;
  onSelect?: (t: T) => void;
  init?: T;
}

const Select = <T,>({ options, render, init, getKey, onSelect } : SelectProps<T>) => {
  if (options.length === 0) {
    throw new Error("Select component requires at least one option.");
  }

  const [ selected, setSelected ] = useState(init || options[0]);
  const [ isOpen, setIsOpen ] = useState(false);

  const handleSelect = (value: T) => {
    if (onSelect) onSelect(value);
    setSelected(value);
    setIsOpen(!isOpen);
  }

  return (
    <div className="select">
      <Option value={selected} render={render} onSelect={handleSelect} />
      {isOpen && (
        <div className="select__options">
          {options
            .filter(opt => getKey(opt) !== getKey(selected))
            .map(opt => (
              <Option
                key={getKey(opt)}
                value={opt}
                render={render}
                onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
