import { FC, useState, ChangeEvent } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import Button from "../../../components/Button";
import TextInput from "../../../components/TextInput";
import { Number, NumberType } from "../../../services/contacts.ts";
import { formatPhoneNumber, extractPhoneNumber } from "../../../util/format.ts";
import "./NumberEditForm.css";

interface Props {
  number: Number;
  setNumber: (numbers: Number) => void;
  deleteNumber: () => void;
}

const getNumberTypes = () => {
  return [NumberType.HOME, NumberType.WORK, NumberType.MOBILE];
}

const NumberEditForm: FC<Props> = ({ number, setNumber, deleteNumber }) => {
  const [localNumber, setLocalNumber] = useState<Number>(number);

  const validateNumber = (number: string): string => {
    if (!number) return "Number is mandatory";
    return "";
  }

  const handleDelete = deleteNumber;

  const handleNumberUnfocus = () => {
    console.log('handel unfocus');
    setNumber({ ...localNumber });
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const typeIndex = event.target.selectedIndex;
    const newType = getNumberTypes()[typeIndex];
    setLocalNumber({ ...localNumber, type: newType });
    setNumber({ ...localNumber, type: newType });
  }

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const number = extractPhoneNumber(event.target.value);
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
        onChange={handleNumberChange}
        onBlur={handleNumberUnfocus}
        validate={validateNumber}
      />
        <Button
          className="transparent-btn delete-btn number-edit-form-delete-btn"
          Icon={BsFillTrash3Fill}
          onClick={handleDelete}
        />
    </div>
  );
}

export default NumberEditForm;
