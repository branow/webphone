import { FC, useState, ChangeEvent } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import TextInput from "../../../components/TextInput";
import { EditableNumber } from "../../../hooks/useContactEditForm";
import { NumberType } from "../../../services/contacts";
import { formatPhoneNumber, extractPhoneNumber } from "../../../util/format";
import "./NumberEditForm.css";

interface Props {
  number: EditableNumber;
  updateNumber: (number: EditableNumber) => void;
  deleteNumber: (number: EditableNumber) => void;
  error?: string;
}

const getNumberTypes = () => {
  return [NumberType.HOME, NumberType.WORK, NumberType.MOBILE];
}

const NumberEditForm: FC<Props> = ({ number, updateNumber, deleteNumber, error }) => {
  const [localNumber, setLocalNumber] = useState<EditableNumber>(number);

  const handleDelete = deleteNumber;

  const handleNumberUnfocus = () => {
    updateNumber({ ...localNumber });
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const typeIndex = event.target.selectedIndex;
    const newType = getNumberTypes()[typeIndex];
    setLocalNumber({ ...localNumber, type: newType });
    updateNumber({ ...localNumber, type: newType });
  }

  const handleNumberChange = (value: string) => {
    const number = extractPhoneNumber(value);
    setLocalNumber({ ...localNumber, number });
  }


  return (
    <div className="number-edit-form">
      <select
        className="number-edit-form-number-type"
        onChange={handleTypeChange}
        value={localNumber.type}
      >
        {getNumberTypes().map(numberType => (
          <option key={numberType} value={numberType}>
            {numberType}
          </option>
        ))}
      </select>
      <TextInput
        className="number-edit-form-number"
        value={formatPhoneNumber(localNumber.number)}
        onValueChange={handleNumberChange}
        onBlur={handleNumberUnfocus}
        error={error}
      />
        <button
          className="transparent-btn delete-btn number-edit-form-delete-btn"
          onClick={() => handleDelete(number)}
        >
          <BsFillTrash3Fill />
        </button>
    </div>
  );
}

export default NumberEditForm;
