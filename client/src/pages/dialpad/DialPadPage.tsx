import { FC, useState, useContext, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { ImPhone } from "react-icons/im";
import { MdBackspace, MdOutlineBackspace } from "react-icons/md";
import { SipContext, RegistrationState } from "../../providers/SipProvider";
import Hover from "../../components/Hover";
import NavTabs, { Tab } from "../../components/NavTabs";
import Keypad, { Key } from "./Keypad";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format.ts";
import "./DialPadPage.css";

const DialPadPage: FC = () => {
  const navigate = useNavigate();
  const { registrationState } = useContext(SipContext)!;
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (registrationState !== RegistrationState.REGISTERED) {
      navigate("/account");
    }
  }, [registrationState, navigate]);

  const handleCall = () => {
    navigate(`/call/${extractPhoneNumber(number)}`);
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

  return (
    <div className="dial-pad-page">
      <div className="dial-pad-page-top">
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
            <button
              className="backspace-btn"
              onClick={handleRemove}
              disabled={!number}
            >
              {number && isHovered ? <MdBackspace /> : <MdOutlineBackspace />}
            </button>
          )}
        </Hover>
      </div>
      <Keypad onPressKey={handleKey} />
      <button
        className="call-btn medium-btn"
        onClick={handleCall}
        disabled={!number}
      >
        <ImPhone />
      </button>
      <NavTabs tabs={[Tab.HISTORY, Tab.CONTACTS]} />
    </div>
  );
};

export default DialPadPage;
