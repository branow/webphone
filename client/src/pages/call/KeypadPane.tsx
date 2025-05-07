import { FC, useContext, useState, ChangeEvent } from "react";
import { CallContext } from "../../context/CallContext";
import Keypad, { Key } from "../dialpad/Keypad";
import TextInput from "../../components/TextInput";
import { extractPhoneNumber } from "../../util/format.js";
import "./KeypadPane.css";

const KeypadPane: FC = () => {
  const { sendDtmf } = useContext(CallContext);
  const [input, setInput] = useState<string>("");

  const handlePressKey = (key: Key) => {
    sendDtmf(key.sign);
    setInput(input + key.sign);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let curInput = event.target.value;
    
    curInput = extractPhoneNumber(curInput);
    // Take only first sign if there were paste more than one.
    if (curInput.length > input.length + 1) {
      curInput = curInput.substring(0, input.length + 1); 
    }
    // Send DTMF if user typed right sign.
    if (curInput.length === input.length + 1) {
      const sign = curInput.charAt(input.length - 1);
      sendDtmf(sign);
    }
    setInput(curInput);
  }

  return (
    <div className="keypad-pane">
      <TextInput
        className="keypad-pane-in"
        value={input}
        onChange={handleChange}
      />
      <Keypad onPressKey={handlePressKey}/>
    </div>
  );
};

export default KeypadPane;
