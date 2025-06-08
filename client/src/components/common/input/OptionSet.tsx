import { ReactNode } from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import TransparentRectButton from "components/common/button/TransparentRectButton";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

interface Props<T> {
  options: T[];
  value: T;
  onChange: (t: T) => void;
  render: (t: T) => ReactNode;
  getKey: (t: T) => string | number;
  disabled?: boolean;
}

const OptionSet = <T,>({ options, render, value, getKey, onChange, disabled }: Props<T>) => {
  if (options.length === 0)
    throw new Error("OptionSet component requires at least one option.");

  return (
    <Container>
      {options.map(option => (
        <Option
          key={getKey(option)}
          value={option}
          checked={option === value}
          render={render}
          onChange={onChange}
          disabled={disabled}
        />
      ))}
    </Container>
  );
};

export default OptionSet;


const cssButton = css`
  flex: 1;
  padding: 5px;
  text-transform: uppercase;
  font-size: ${font.size.m}px;
  border-radius: 5px;
`;

interface OptionProps<T> {
  value: T;
  checked: boolean;
  render: (value: T) => ReactNode;
  onChange: (value: T) => void;
  disabled?: boolean;
}

const Option = <T,>({ value, render, onChange, checked, disabled } : OptionProps<T>) => {
  const th = useTheme();

  return (
    <TransparentRectButton
      className={cssButton}
      style={{ borderBottom: `3px solid ${ checked ? th.colors.surface2 : "#0000" }` }}
      onClick={() => onChange(value)}
      disabled={disabled}
    >
      {render(value)}
    </TransparentRectButton>
  );
};
