import { FC } from "react";
import { FaPlus } from "react-icons/fa";
import { styled } from "@linaria/react";
import ErrorMessage from "../../common/messages/ErrorMessage";
import NumberForm from "../../contact/form/NumberForm";
import { EditableNumber } from "../../../hooks/useEditContact";
import { useTheme } from "../../../hooks/useTheme";
import { NumberType } from "../../../services/contacts";
import { hex } from "../../../util/identifier";
import AutoHeightMotion from "../../common/motion/AutoHeightMotion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AddButton = styled.button<{ color: string, bg: string, bgHover: string, bgDisabled: string }>`
  color: ${p => p.color};
  background-color: ${p => p.bg};
  padding: 5px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all ease-in-out 0.25s;
  display: flex;
  justify-content: center;

  &:not(:disabled):hover {
    background-color: ${p => p.bgHover};
  }

  &:active {
    background-color: ${p => p.color};
  }

  &:disabled {
    background-color: ${p => p.bgDisabled};
  }
`;

interface Props {
  numbers: EditableNumber[];
  setNumbers: (numbers: EditableNumber[]) => void;
  error?: string;
  numberErrors?: string[];
}

const NumbersEditForm: FC<Props> = ({ numbers, setNumbers, error, numberErrors }) => {
  const th = useTheme();

  const handleAdd = () => {
    const newNumber = { id: hex(4), type: NumberType.HOME, number: "" };
    setNumbers([...numbers, newNumber ]);
  }

  const deleteNumber = (number: EditableNumber) => {
    setNumbers(numbers.filter((n) => n.id !== number.id ));
  }

  const updateNumber = (number: EditableNumber) => {
    setNumbers(numbers.map((n) => n.id === number.id ? number : n));
  }

  return (
    <Container>
      <AutoHeightMotion>
        <ErrorMessage error={error} />
        {numbers.map((number, i) => (
          <NumberForm
            key={number.id}
            number={number}
            updateNumber={updateNumber}
            deleteNumber={() => deleteNumber(number)}
            error={numberErrors ? numberErrors[i] : undefined}
          />
        ))}
      </AutoHeightMotion>
      <AddButton
        color={th.colors.iconLight}
        bg={th.colors.green}
        bgHover={th.colors.greenHover}
        bgDisabled={th.colors.bgDisabled}
        onClick={handleAdd}
        disabled={numbers.length >= 10}
      >
        <FaPlus />
      </AddButton>
    </Container>
  );
}

export default NumbersEditForm;
