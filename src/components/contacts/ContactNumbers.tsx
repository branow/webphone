import { FC, ReactNode } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { ImMobile } from "react-icons/im";
import { MdOutlineWork } from "react-icons/md";
import { Number, NumberType } from "../../services/contactApi";
import "./ContactNumbers.css";

interface Props {
  iconSize: string;
  numbers: Number[];
}

const ContactNumbers: FC<Props> = ({ iconSize, numbers }) => {
  const getNumberTypeIcon = (type: NumberType): ReactNode => {
    switch(type) {
      case NumberType.HOME: return <IoHomeSharp size={iconSize} />;
      case NumberType.WORK: return <MdOutlineWork size={iconSize} />;
      case NumberType.MOBILE: return <ImMobile size={iconSize} />;
    }
  }

  return (
    <div className="contact-numbers">
      {numbers.map(number => (
        <div className="contact-numbers-number" key={number.number}>
          <div className="contact-numbers-number-type">
            <div className="contact-numbers-number-type-icon">
              {getNumberTypeIcon(number.type)}
            </div>
            <div className="contact-numbers-number-type-lable">
              {number.type}
            </div>
          </div>
          <div className="contact-numbers-number-number">
            {number.number}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactNumbers;
