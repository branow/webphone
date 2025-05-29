import { FC } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { ImMobile } from "react-icons/im";
import { MdOutlineWork } from "react-icons/md";
import { NumberType } from "../../services/contacts.ts";

interface Props {
  type: NumberType;
}

const NumberTypeIcon: FC<Props> = ({ type }) => {
  switch(type) {
    case NumberType.HOME: return <IoHomeSharp />;
    case NumberType.WORK: return <MdOutlineWork />;
    case NumberType.MOBILE: return <ImMobile />;
  }
}

export default NumberTypeIcon;
