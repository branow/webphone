import { FC, useContext } from "react";
import { styled } from "@linaria/react";
import Photo from "components/contact/photo/Photo";
import Video from "pages/call/active/Video";
import ActiveVideoWatcher from "pages/call/active/ActiveVideoWatcher";
import { useTheme } from "hooks/useTheme";
import { CallContext } from "context/CallContext";
import { Contact } from "services/contacts";
import { CallDirection } from "lib/sip";
import { formatPhoneNumber } from "util/format";
import { font } from "styles";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div<{ color: string }>`
  font-size: ${font.size.xl}px;
  color: ${p => p.color};
`;

const Subtitle = styled.div<{ color: string }>`
  font-size: ${font.size.l}px;
  color: ${p => p.color};
`;

interface Props {
  contact?: Contact;
}

const CallTopPane: FC<Props> = ({ contact }) => {
  const th = useTheme();
  const { call } = useContext(CallContext);
  if (!call) throw new Error("Call is not initialized");

  const shouldShowLocalVideo = (call.state.isOnProgress() && call.direction === CallDirection.OUTGOING) ||
      call.state.isEstablished();

  return (
    <Container>
      <Top>
        {shouldShowLocalVideo && (
          <ActiveVideoWatcher
            stream={call.localStream}
            renderWhenOn={() => <Video stream={call.localStream} size={130} />}
          />
        )}
        <ActiveVideoWatcher
          stream={call.remoteStream}
          renderWhenOn={() => <Video stream={call.remoteStream} size={130} />}
          renderWhenOff={() => <Photo size={130} src={contact?.photo} />}
        />
      </Top>
      <TitleContainer>
        <Title color={th.colors.text}>
          {contact ? contact.name : formatPhoneNumber(call.number)}
        </Title>
        {contact && (
          <Subtitle color={th.colors.subtitle}>
            {formatPhoneNumber(call.number)}
          </Subtitle>
        )}
      </TitleContainer>
    </Container>
  );
};

export default CallTopPane;
