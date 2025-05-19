import { ReactNode } from "react";

interface OptionProps<T> {
  value: T;
  render: (t: T) => ReactNode;
  onSelect: (t: T) => void;
}

const Option = <T,>({ value, render, onSelect } : OptionProps<T>) => {
  return (
    <div className="option" onClick={() => onSelect(value)}>
      {render(value)}
    </div>
  );
};

export default Option;
