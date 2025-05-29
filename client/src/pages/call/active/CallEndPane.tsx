import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { styled } from "@linaria/react";
import ScaleButton from "../../../components/common/button/ScaleButton";
import DurationInMs from "../../../components/call/DurationInMs";
import { useTheme } from "../../../hooks/useTheme";
import { CallContext } from "../../../context/CallContext";
import HistoryApi, { CallStatus } from "../../../services/history";
import { CallOriginator, Call } from "../../../lib/sip";
import { d } from "../../../lib/i18n";
import DTMFAudio from "../../../util/dtmf.js";
import { Paths } from "../../../routes";
import { font } from "../../../styles";

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const Status = styled.div`
  font-size: ${font.size.xl}px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Message = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-size: ${font.size.m}px;
`;

const Duration = styled.div<{ color: string }>`
  font-size: ${font.size.m}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const Back = styled.div`
  text-transform: uppercase;
  font-size: ${font.size.m}px;
  font-weight: bold;
`;

const CallEndPane: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { call } = useContext(CallContext) as { call: Call };

  useEffect(() => {
    DTMFAudio.playCustom("howler");
    setTimeout(() => {
      DTMFAudio.stop();
    }, 1000);

    const moveBackTimeout = setTimeout(back, 5000);

    return () => {
      DTMFAudio.stop();
      clearTimeout(moveBackTimeout);
    }
  }, [])

  const { mutate } = useMutation({
    mutationFn: HistoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: HistoryApi.QueryKeys.predicate });
    }
  });

  useEffect(() => {
    mutate({
      number: call!.number,
      status: status,
      startDate: call!.startTime,
      endDate: call!.endTime,
    });
  }, [mutate])

  const status = getCallStatus(call);

  const back = () => navigate(Paths.Dialpad());

  const isEndedByLocal = () => {
    return !call.error && call.endedBy === CallOriginator.LOCAL;
  }

  const isEndedByRemote = () => {
    return !call.error && call.endedBy === CallOriginator.REMOTE;
  }

  const th = useTheme();

  return (
    <Container>
      <MessageContainer>
        <Status>
          {!call.error && (
            <div style={{ color: th.colors.green }}>
              {t(d.call.messages.success)}
            </div>
          )}
          {call.error && (
            <div style={{ color: th.colors.red }}>
              {t(d.call.messages.failed)}
            </div>
          )}
        </Status>
        <Message color={th.colors.subtitle}>
          {call.error && t(mapErrorMessage("error"))}
          {isEndedByLocal() && t(d.call.messages.endedByYou)}
          {isEndedByRemote() && t(d.call.messages.endedByOther)}
        </Message>
        {call.endTime && (
          <Duration color={th.colors.subtitle}>
            <DurationInMs date1={call.startTime} date2={call.endTime} />
          </Duration>
        )}
      </MessageContainer>
      <ScaleButton
        size={70}
        bg={th.colors.green}
        bgHover={th.colors.greenHover}
        onClick={back}
      >
        <Back>{t(d.ui.buttons.back)}</Back>
      </ScaleButton>
    </Container>
  );
};

function mapErrorMessage(error: string): string {
  if (error === "Address Incomplete") return d.call.errors.invalidNumber; // invalid number
  if (error === "Unavailable") return d.call.errors.unavailable; // you tried to call didn't get answer
  if (error === "No Answer") return d.call.errors.noAnswer; // you didn't answer in time (missed)
  if (error === "Rejected") return d.call.errors.rejected; // you didn't answer
  return error;
}

function getCallStatus(call: Call): CallStatus {
  if (call.error) {
    if (call.error == "No Answer") {
      return CallStatus.MISSED;
    } else {
      return CallStatus.FAILED;
    }
  } else {
    if (call.startedBy === CallOriginator.LOCAL) {
      return CallStatus.OUTGOING;
    } else {
      return CallStatus.INCOMING;
    }
  }
}

export default CallEndPane;
