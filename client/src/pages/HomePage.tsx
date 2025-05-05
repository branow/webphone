import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { SipContext, RegistrationState } from "../providers/SipProvider";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { registrationState } = useContext(SipContext)!;

  useEffect(() => {
    if (registrationState === RegistrationState.UNREGISTERED) {
      navigate("/account");
    } else {
      navigate("/dialpad");
    }
  }, [navigate, registrationState]);

  return (<></>);
}

export default HomePage;
