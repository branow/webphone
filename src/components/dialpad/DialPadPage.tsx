import { FC, useState, useContext, useEffect, ChangeEvent } from "react";
import { motion as m } from "framer-motion";
import Keypad, { Key } from "./Keypad";
import Button from "../Button"
import { ImPhone } from "react-icons/im";
import { VscHistory } from "react-icons/vsc";
import { MdBackspace, MdOutlineBackspace } from "react-icons/md";
import { SipContext, RegistrationState } from "../account/SipProvider";
import { TabContext, Tab } from "../Phone";
import { CallContext } from "../call/CallProvider";
import Hover from "../Hover";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format.ts";
import "./DialPadPage.css";

const DialPadPage: FC = () => {
  const { registrationState } = useContext(SipContext)!;
  const { switchTab } = useContext(TabContext)!;
  const { doCall } = useContext(CallContext)!;
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (registrationState !== RegistrationState.REGISTERED) {
      switchTab(Tab.ACCOUNT);
    }
  }, [registrationState]);

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
    <m.div
      className="dial-pad-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, easy: "easeOut" }}
    >
      <div className="dial-pad-page-top">
        <Button
          className="transparent-btn history-btn"
          Icon={VscHistory}
          onClick={handleHistoryPage}
        />
        <input
          id="phoneNumber"
          className="number-in"
          type="text"
          placeholder="Phone number"
          value={number}
          onChange={handleChange}
        />
        <Hover>
          {isHovered => (
            <Button
              className="backspace-btn"
              Icon={number && isHovered ? MdBackspace : MdOutlineBackspace}
              onClick={handleRemove}
              disabled={!number}
            />
          )}
        </Hover>
      </div>
      <Keypad onPressKey={handleKey} />
      <Button
        className="call-btn medium-btn"
        Icon={ImPhone}
        onClick={handleCall}
        disabled={!number}
      />
    </m.div>
  );
};

export default DialPadPage;
