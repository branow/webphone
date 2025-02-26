import { FC, ReactNode } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { ImMobile, ImPhone } from "react-icons/im";
import { MdOutlineWork } from "react-icons/md";
import Button from "../../components/Button";
import { Number, NumberType } from "../../services/contacts";
import { formatPhoneNumber } from "../../util/format";
import "./ContactNumbers.css";

interface Props {
  numbers: Number[];
  call?: (number: string) => void; 
}

const ContactNumbers: FC<Props> = ({ numbers, call }) => {
  const getNumberTypeIcon = (type: NumberType): ReactNode => {
    switch(type) {
      case NumberType.HOME: return <IoHomeSharp />;
      case NumberType.WORK: return <MdOutlineWork />;
      case NumberType.MOBILE: return <ImMobile />;
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
          <div className="contact-numbers-number-ctn">
            <div className="contact-numbers-number-number">
              {formatPhoneNumber(number.number)}
            </div>
            {call && (
              <Button
                className="call-btn small-btn"
                Icon={ImPhone}
                onClick={() => call(number.number)}
                disabled={!number}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactNumbers;
