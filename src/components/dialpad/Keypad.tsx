import { FC } from "react";
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
  return (
    <div className="keypad">
      {keys.map(key => (
        <button key={"key-" + key.sign} onClick={() => onPressKey(key)}>
          <div>{key.sign}</div>
          <div>{key.label}</div>
        </button>
      ))}
    </div>
  );
};

export default Keypad;
