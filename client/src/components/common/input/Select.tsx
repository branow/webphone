import { ReactNode, useState } from "react";
import { styled } from "@linaria/react";
import AutoHeightMotion from "components/common/motion/AutoHeightMotion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: 100%;
`

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
    <Container>
      <Option value={selected} render={render} onSelect={handleSelect} />
      <OptionsContainer>
        <AutoHeightMotion>
          <div style={{ height: isOpen ? "auto" : 0 }}>
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
        </AutoHeightMotion>
      </OptionsContainer>
    </Container>
  );
};

export default Select;

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
