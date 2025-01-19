import { FC, useState, useContext, ChangeEvent } from "react";
import Keypad, { Key } from "./Keypad";
import Button from "../Button"
import { FiPhone } from "react-icons/fi";
import { VscHistory } from "react-icons/vsc";
import { TiBackspaceOutline } from "react-icons/ti";
import { TabContext, Tab } from "../Phone";
import { CallContext } from "../call/CallProvider.tsx";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format.ts";

const DialPadPage: FC = () => {
  const { switchTab } = useContext(TabContext)!;
  const { doCall } = useContext(CallContext)!;
  const [number, setNumber] = useState("");

  const handleCall = () => {
    switchTab(Tab.CALL);
    doCall(extractPhoneNumber(number));
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newNumber = formatPhoneNumber(event.target.value);
    setNumber(newNumber);
  }

  const handleKey = ({ sign }: Key) => {
    const newNumber = formatPhoneNumber(number + sign);
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
      <Button Icon={FiPhone} onClick={handleCall} disabled={!number} />
    </div>
  );
};

export default DialPadPage;
