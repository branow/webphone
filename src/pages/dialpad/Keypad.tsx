import { FC } from "react";
import DTMFAudio from "../../util/dtmf.js";
import "./Keypad.css";

export interface Key {
  sign: string;
  label: string;
}

interface Props {
  onPressKey: (key: Key) => void;
}

const keys: Key[] = [
  { sign: "1", label: "" },
  { sign: "2", label: "ABC" },
  { sign: "3", label: "DEF" },
  { sign: "4", label: "GHI" },
  { sign: "5", label: "JKL" },
  { sign: "6", label: "MNO" },
  { sign: "7", label: "PQRS" },
  { sign: "8", label: "TUV" },
  { sign: "9", label: "WXYZ" },
  { sign: "*", label: "" },
  { sign: "0", label: "+" },
  { sign: "#", label: "" },
];

const Keypad: FC<Props> = ({ onPressKey }) => {
  const handlePressKey = (key: Key) => {
    onPressKey(key);
    DTMFAudio.play(key.sign);
  }

  return (
    <div className="keypad">
      {keys.map(key => (
        <button
          className="transparent-btn keypad-key"
          key={"key-" + key.sign}
          onClick={() => handlePressKey(key)}
        >
          <div className="keypad-key-sign" >{key.sign}</div>
          <div className="keypad-key-label" >{key.label}</div>
        </button>
      ))}
    </div>
  );
};

export default Keypad;
