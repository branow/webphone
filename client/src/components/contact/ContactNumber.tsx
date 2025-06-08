import { FC, useContext } from "react";
import { styled } from "@linaria/react";
import NumberTypeLabel from "./NumberTypeLabel";
import CallButton from "../call/CallButton";
import { useTheme } from "../../hooks/useTheme";
import { Number } from "../../services/contacts";
import { formatPhoneNumber } from "../../util/format";
import { font } from "../../styles";
import { SipContext } from "../../context/SipContext";

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NumberContainer = styled.div<{ color: string, fontSize: number }>`
  font-size: ${p => p.fontSize}px;
  color: ${p => p.color};
`;

interface Props {
  number: Number;
  call?: (number: string) => void;
  fontSize?: number;
}

const ContactNumber: FC<Props> = ({ number, call, fontSize = font.size.s }) => {
  const { connection } = useContext(SipContext);
  const th = useTheme();

  return (
    <Container>
      <NumberTypeLabel type={number.type} fontSize={fontSize} />
      <LeftContainer>
        <NumberContainer color={th.colors.title} fontSize={fontSize}>
          {formatPhoneNumber(number.number)}
        </NumberContainer>
        {call && (
          <CallButton
            onClick={() => call(number.number)}
            size={fontSize * 2}
            disabled={!connection.isConnected()}
          />
        )}
      </LeftContainer>
    </Container>
  );
}

export default ContactNumber;
