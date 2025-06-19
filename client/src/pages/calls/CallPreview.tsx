import { FC, useContext } from "react";
import { styled } from "@linaria/react";
import Photo from "components/contact/photo/Photo";
import CallPreviewControls from "./CallPreviewControls";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";
import { Call } from "lib/sip";
import { useFetchContactByNumber } from "hooks/fetch";
import { AccountContext } from "context/AccountContext";
import CallProvider from "providers/CallProvider";
import { extractPhoneNumber, formatPhoneNumber } from "util/format";

const Container = styled.div`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 5px;
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Name = styled.div<{ color: string }>`
  font-size: ${font.size.m};
  text-align: center;
`

interface Props {
  call: Call;
  onClick?: () => void,
}

const CallPreview: FC<Props> = ({ call }) => {
  const th = useTheme();

  const { account } = useContext(AccountContext);
  const { contact } = useFetchContactByNumber({
    user: account?.user || "none",
    number: extractPhoneNumber(call.number),
    enabled: !!account,
  });

  return (
    <Container>
      <Photo src={contact?.photo} size={60} alt={`${call.number}'s photo`} />
      <Info>
        <Name color={th.colors.text}>
          {contact ? contact.name : formatPhoneNumber(call.number)}
        </Name>
        <CallProvider callId={call.id}>
          <CallPreviewControls />
        </CallProvider>
      </Info>
    </Container>
  );
};

export default CallPreview;
