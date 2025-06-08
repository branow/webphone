import { FC } from "react";
import { 
  BsFillTelephoneInboundFill,
  BsFillTelephoneOutboundFill,
  BsFillTelephoneXFill,
  BsBan,
} from "react-icons/bs";
import { useTheme } from "hooks/useTheme";
import { CallStatus } from "services/history";

interface Props {
  status: CallStatus;
}

const StatusIcon: FC<Props> = ({ status }) => {
  const th = useTheme();

  switch(status) {
    case CallStatus.INCOMING:
      return <BsFillTelephoneInboundFill color={th.colors.gray}/>;
    case CallStatus.OUTGOING:
      return <BsFillTelephoneOutboundFill color={th.colors.green}/>;
    case CallStatus.MISSED:
      return <BsFillTelephoneXFill color={th.colors.red}/>;
    case CallStatus.FAILED:
      return <BsBan color={th.colors.blue}/>
    default:
      return <></>
  }
};


export default StatusIcon;
