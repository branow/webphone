import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import Keypad, { Key } from "../../components/keypad/Keypad";
import NavTabs, { Tab } from "../../components/navtabs/NavTabs";
import CallButton from "../../components/call/CallButton";
import NumberInputPane from "./NumberInputPane";
import { formatPhoneNumber, extractPhoneNumber } from "../../util/format";
import { Paths } from "../../routes";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const DialPadPageContent: FC = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");

  const handleCall = () => {
    navigate(Paths.Call({ number: extractPhoneNumber(number) }));
  }

  const handleKey = ({ sign }: Key) => {
    const newNumber = formatPhoneNumber(number + sign);
    setNumber(newNumber);
  }

  return (
    <Container>
      <NumberInputPane number={number} setNumber={(n) => setNumber(formatPhoneNumber(n))} />
      <Keypad onPressKey={handleKey} />
      <CallButton size={60} onClick={handleCall} disabled={!number} />
      <NavTabs tabs={[Tab.HISTORY, Tab.CONTACTS]} />
    </Container>
  );
};

export default DialPadPageContent;
