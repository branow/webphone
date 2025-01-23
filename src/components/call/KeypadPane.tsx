import { FC, useContext, useState, ChangeEvent } from "react";
import { CallContext } from "./CallProvider";
import Keypad, { Key } from "../dialpad/Keypad";
import TextInput from "../TextInput";
import "./KeypadPane.css";

const KeypadPane: FC = () => {
  const { call } = useContext(CallContext)!;
  const [input, setInput] = useState<string>("");

  const handlePressKey = (key: Key) => {
    console.log(key.sign);
    call!.sendDTMF(key.sign);
    setInput(input + key.sign);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let curInput = event.target.value;
    
    curInput = curInput.replaceAll(/[^0-9*#]/g, "");
    // Take only first sign if there were paste more than one.
    if (curInput.length > input.length + 1) {
      curInput = curInput.substring(0, input.length + 1); 
    }
    // Send DTMF if user typed right sign.
    if (curInput.length === input.length + 1) {
      const sign = curInput.charAt(input.length - 1);
      call!.sendDTMF(sign);
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
