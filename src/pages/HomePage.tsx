import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { SipContext, RegistrationState } from "../providers/SipProvider";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { registrationState } = useContext(SipContext)!;

  if (registrationState === RegistrationState.UNREGISTERED) {
    navigate("/account");
  } else {
    navigate("/dialpad");
  }
  
  return (<></>);
}

export default HomePage;
