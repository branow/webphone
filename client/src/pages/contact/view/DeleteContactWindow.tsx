import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import TransparentRectButton from "../../../components/common/button/TransparentRectButton";
import Window from "../../../components/common/pane/Window";
import { useTheme } from "../../../hooks/useTheme";
import { d } from "../../../lib/i18n";
import { font } from "../../../styles";

const Container = styled.div`
  width: 225px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Message = styled.div<{ color: string }>`
  font-size: ${font.size.m};
  color: ${p => p.color};
`;

const ControlContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Label = styled.div`
  padding: 5px;
  text-transform: uppercase;
  font-size: ${font.size.m}px;
  font-weight: bold;
`;

interface Props {
  contactName: string;
  close: () => void;
  deleteContact: () => void;
}

const DeleteContactWindow: FC<Props> = ({ contactName, deleteContact, close }) => {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Window close={close}>
      <Container>
        <Message color={th.colors.text}>
          <Trans
            i18nKey={d.contact.messages.deleteWarning}
            values={{ name: contactName }}
            components={{ bold: <strong /> }}
          />
        </Message>
        <ControlContainer>
          <TransparentRectButton onClick={deleteContact}>
            <Label>{t(d.ui.buttons.ok)}</Label>
          </TransparentRectButton>
          <TransparentRectButton onClick={close}>
            <Label>{t(d.ui.buttons.cancel)}</Label>
          </TransparentRectButton>
        </ControlContainer>
      </Container>
    </Window>
  );
}

export default DeleteContactWindow;
