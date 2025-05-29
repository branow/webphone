import { FC } from "react";
import { styled } from "@linaria/react";
import KeypadButton from "./KeypadButton";
import { font } from "../../styles";

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

const KeypadContainer = styled.div<{ size: number }>`
  width: fit-content;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${p => p.size / 2}px;
`;

export interface Key {
  sign: string;
  label: string;
}

interface Props {
  onPressKey: (key: Key) => void;
  size?: number;
}

const Keypad: FC<Props> = ({ size, onPressKey }) => {
  size = size ?? font.size.xl;
  return (
    <KeypadContainer size={size}>
      {keys.map(key => (
        <KeypadButton
          size={size}
          key={"key-" + key.sign}
          sign={key.sign}
          label={key.label}
          onPressKey={() => onPressKey(key)}
        />
      ))}
    </KeypadContainer>
  );
};

export default Keypad;
