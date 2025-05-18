import { FC } from "react";
import { FaPlus } from "react-icons/fa";
import ErrorMessage from "../../../components/ErrorMessage";
import NumberEditForm from "./NumberEditForm";
import { EditableNumber } from "../../../hooks/useContactEditForm";
import { NumberType } from "../../../services/contacts";
import { hex } from "../../../util/identifier";
import "./ContactEditForm.css";

interface Props {
  numbers: EditableNumber[];
  setNumbers: (numbers: EditableNumber[]) => void;
  error?: string;
  numberErrors?: string[];
}


const NumbersEditForm: FC<Props> = ({ numbers, setNumbers, error, numberErrors }) => {

  const handleAdd = () => {
    const newNumber = { id: hex(4), type: NumberType.HOME, number: "" };
    setNumbers([...numbers, newNumber ]);
  }

  const handleDelete = (number: EditableNumber) => {
    setNumbers(numbers.filter((n) => n.id !== number.id ));
  }

  const handleUpdate = (number: EditableNumber) => {
    setNumbers(numbers.map((n) => n.id === number.id ? number : n));
  }

  return (
    <div className="contact-edit-form-numbers">
      <ErrorMessage error={error} />
      {numbers.map((number, i) => (
        <NumberEditForm
          key={number.id}
          number={number}
          updateNumber={handleUpdate}
          deleteNumber={handleDelete}
          error={numberErrors ? numberErrors[i] : undefined}
        />
      ))}
      <button
        className="contact-edit-form-numbers-add-btn"
        onClick={handleAdd}
        disabled={numbers.length >= 10}
      >
        <FaPlus />
      </button>
    </div>
  );
}

export default NumbersEditForm;
