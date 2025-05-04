import { FC } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "../../../components/Button";
import { EditableNumber } from "./ContactEditForm";
import NumberEditForm from "./NumberEditForm";
import { NumberType } from "../../../services/contacts";
import { hex } from "../../../util/identifier";
import "./ContactEditForm.css";

interface Props {
  numbers: EditableNumber[];
  setNumbers: (numbers: EditableNumber[]) => void;
}


const NumbersEditForm: FC<Props> = ({ numbers, setNumbers }) => {

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
      {numbers.map((number) => (
        <NumberEditForm
          key={number.id}
          number={number}
          updateNumber={handleUpdate}
          deleteNumber={handleDelete}
        />
      ))}
      <Button
        className="contact-edit-form-numbers-add-btn"
        Icon={FaPlus}
        onClick={handleAdd}
        disabled={numbers.length >= 10}
      />
    </div>
  );
}

export default NumbersEditForm;
