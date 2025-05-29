import { FC } from "react";
import { styled } from "@linaria/react";
import ContactNumber from "./ContactNumber";
import { Number } from "../../services/contacts";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

interface Props {
  numbers: Number[];
  call?: (number: string) => void;
  fontSize?: number;
}

const ContactNumbers: FC<Props> = ({ numbers, call, fontSize }) => {
  return (
    <Container>
      {numbers.map(number => (
        <ContactNumber
          key={number.number}
          number={number}
          call={call}
          fontSize={fontSize}
        />
      ))}
    </Container>
  );
}

export default ContactNumbers;
