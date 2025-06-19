import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";
import { Call } from "lib/sip";
import { d } from "lib/i18n";
import { font } from "styles";
import ClickableCallPreview from "./ClickableCallPreview";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div<{ color: string }>`
  padding: 20px;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
  text-align: center;
`;

interface Props {
  calls: Call[];
}

const Calls: FC<Props> = ({ calls }) => {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Container>
      {calls.length === 0 && (
        <Message color={th.colors.textDisabled}>
          {t(d.calls.messages.noCalls)}
        </Message>
      )}
      {calls.map(call => (
        <ClickableCallPreview key={call.id} call={call} />
      ))}
    </Container>
  );
}

export default Calls;
