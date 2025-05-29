import { FC } from "react";
import NumberInput from "./NumberInput";
import NumberCleanButton from "./NumberCleanButton";
import { styled } from "@linaria/react";

interface Props {
  number: string;
  setNumber: (number: string) => void;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const CleanButtonContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 7px;
`

const NumberInputPane: FC<Props> = ({ number, setNumber }) => {
  const clean = () => {
    const newNumber = number.substring(0, number.length - 1);
    setNumber(newNumber);
  }

  return (
    <Container>
      <NumberInput number={number} setNumber={setNumber} />
      <CleanButtonContainer>
        <NumberCleanButton clean={clean} enabled={!!number} />
      </CleanButtonContainer>
    </Container>
  );
};

export default NumberInputPane;
