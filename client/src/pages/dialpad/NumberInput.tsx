import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import { useTheme } from "../../hooks/useTheme";
import { d } from "../../lib/i18n";
import { font } from "../../styles";

interface Props {
  number: string,
  setNumber: (number: string) => void;
}

const StyledNumberInput = styled.input<{ color: string, phColor: string }>`
  width: 180px;
  font-size: ${font.size.xl}px;
  border: none;
  color: ${p => p.color};
  background-color: #0000;

  &:focus-visible {
    outline: none;
  }

  &:focus {
    outline: none;
  }

  /* Firefox */
  &::placeholder {
    color: ${p => p.phColor};
  }

  /* Edge 12 - 18 */
  &::-ms-input-placeholder {
    color: ${p => p.phColor};
  }
`;

const NumberInput: FC<Props> = ({ number, setNumber }) => {
  const { t } = useTranslation();
  const th = useTheme();

  return (
    <StyledNumberInput
      color={th.colors.text}
      phColor={th.colors.textDisabled}
      type="text"
      placeholder={t(d.dialpad.placeholder)}
      value={number}
      onChange={event => setNumber(event.target.value)}
    />
  );
};

export default NumberInput;
