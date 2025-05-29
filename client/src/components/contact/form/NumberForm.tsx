import { FC, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import TextInput from "../../common/input/TextInput";
import DeleteButton from "../../common/button/DeleteButton";
import { EditableNumber } from "../../../hooks/useEditContact";
import { useTheme } from "../../../hooks/useTheme";
import { NumberType } from "../../../services/contacts";
import { d } from "../../../lib/i18n";
import { formatPhoneNumber, extractPhoneNumber } from "../../../util/format";
import { font } from "../../../styles";

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1.25fr 3fr 0.5fr;
  gap: 5px;
  align-items: end;
`;

const Select = styled.select<{ border: string, color: string }>`
  font-size: ${font.size.m}px;
  border: none;
  border-bottom: 2px solid ${p => p.border};
  color: ${p => p.color};
  background-color: #0000;
`;

interface Props {
  number: EditableNumber;
  updateNumber: (number: EditableNumber) => void;
  deleteNumber: () => void;
  error?: string;
}

const NumberForm: FC<Props> = ({ number, updateNumber, deleteNumber, error }) => {

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const typeIndex = event.target.selectedIndex;
    const newType = getNumberTypes()[typeIndex];
    updateNumber({ ...number, type: newType });
  }

  const handleNumberChange = (value: string) => {
    updateNumber({ ...number, number: extractPhoneNumber(value) });
  }

  const { t } = useTranslation();
  const th = useTheme();

  return (
    <Container>
      <Select
        color={th.colors.subtitle}
        border={th.colors.surface2}
        onChange={handleTypeChange}
        value={number.type}
      >
        {getNumberTypes().map(numberType => (
          <option key={numberType} value={numberType}>
            {t(d.contact.numberTypes[numberType])}
          </option>
        ))}
      </Select>
      <TextInput
        value={formatPhoneNumber(number.number)}
        onValueChange={handleNumberChange}
        error={error}
      />
      <DeleteButton size={font.size.l} remove={deleteNumber} />
    </Container>
  );
}

function getNumberTypes() {
  return [NumberType.HOME, NumberType.WORK, NumberType.MOBILE];
}

export default NumberForm;
