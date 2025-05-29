import { FC, useContext, useState } from "react";
import { styled } from "@linaria/react";
import Keypad, { Key } from "../../../components/keypad/Keypad";
import TextInput from "../../../components/common/input/TextInput";
import { CallContext } from "../../../context/CallContext";
import { extractPhoneNumber } from "../../../util/format";
import { font } from "../../../styles";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px
`;

const InputContainer = styled.div`
  width: 200px;
`;

const KeypadPane: FC = () => {
  const { sendDtmf } = useContext(CallContext);
  const [input, setInput] = useState<string>("");

  const handlePressKey = (key: Key) => {
    sendDtmf(key.sign);
    setInput(input + key.sign);
  }

  const handleChange = (value: string) => {
    if (value.length <= input.length) return;
    
    value = extractPhoneNumber(value);
    // Take only first sign if there were paste more than one.
    if (value.length > input.length + 1) {
      value = value.substring(0, input.length + 1);
    }
    // Send DTMF if user typed right sign.
    if (value.length === input.length + 1) {
      const sign = value.charAt(input.length - 1);
      sendDtmf(sign);
    }
    setInput(value);
  }

  return (
    <Container>
      <InputContainer>
        <TextInput
          value={input}
          onValueChange={handleChange}
        />
      </InputContainer>
      <Keypad size={font.size.l} onPressKey={handlePressKey}/>
    </Container>
  );
};

export default KeypadPane;
