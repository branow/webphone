import { FC, useState, useContext, ChangeEvent } from "react";
import Keypad, { Key } from "./Keypad";
import Button from "../Button"
import { FiPhone } from "react-icons/fi";
import { VscHistory } from "react-icons/vsc";
import { TiBackspaceOutline } from "react-icons/ti";
import { TabContext, Tab } from "../Phone";

const DialPadPage: FC = () => {
  const { switchTab } = useContext(TabContext)!;
  const [number, setNumber] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newNumber = parsePhoneNumber(event.target.value);
    setNumber(newNumber);
  }

  const handleKey = ({ sign }: Key) => {
    const newNumber = parsePhoneNumber(number + sign);
    setNumber(newNumber);
  }

  const handleRemove = () => {
    const newNumber = number.substring(0, number.length - 1);
    setNumber(newNumber);
  }

  const handleHistoryPage = () => switchTab(Tab.HISTORY);

  return (
    <div>
      <Button Icon={VscHistory} onClick={handleHistoryPage}/>
      <input 
        type="text" 
        placeholder="phone number"
        value={number} 
        onChange={handleChange} />
      <Button Icon={TiBackspaceOutline} onClick={handleRemove} />
      <Keypad onPressKey={handleKey} />
      <Button Icon={FiPhone} />
    </div>
  );
};

function parsePhoneNumber(number: string): string {
  number = number.replaceAll(/[^0-9*#]+/g, "");
  if (number.length > 10) {
    number = number.substring(0, 10);
  }
  if (number.length > 3) {
    number = number.substring(0, 3) + " " + number.substring(3, number.length);
  }
  if (number.length > 7) {
    number = number.substring(0, 7) + " " + number.substring(7, number.length);
  }
  return number; 
}


export default DialPadPage;
