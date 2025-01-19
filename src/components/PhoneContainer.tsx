import { FC, ReactNode } from "react";
import "./PhoneContainer.css";

interface Props {
  children: ReactNode;
}

const PhoneContainer: FC<Props> = ({ children }) => {
  return (
    <div className="phone-container-outer">
      <div className="phone-container-inner">
        { children }
      </div>
    </div>
  );
};

export default PhoneContainer;
