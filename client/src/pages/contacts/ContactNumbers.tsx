import { FC } from "react";
import {ImPhone } from "react-icons/im";
import NumberTypeIcon from "../../components/NumberTypeIcon";
import { Number } from "../../services/contacts";
import { formatPhoneNumber } from "../../util/format";
import "./ContactNumbers.css";

interface Props {
  numbers: Number[];
  call?: (number: string) => void; 
}

const ContactNumbers: FC<Props> = ({ numbers, call }) => {
  return (
    <div className="contact-numbers">
      {numbers.map(number => (
        <div className="contact-numbers-number" key={number.number}>
          <div className="contact-numbers-number-type">
            <div className="contact-numbers-number-type-icon">
              <NumberTypeIcon type={number.type} />
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
              <button
                className="call-btn small-btn"
                onClick={() => call(number.number)}
                disabled={!number}
              >
                <ImPhone />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactNumbers;
