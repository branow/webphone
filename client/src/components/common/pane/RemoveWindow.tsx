import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import Window from "components/common/pane/Window";
import ControlPane from "components/common/pane/ControlPane";
import { useTheme } from "hooks/useTheme";
import { d } from "lib/i18n";
import { font, size } from "styles";

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

interface Props {
  children: ReactNode;
  remove: () => void;
  cancel: () => void;
  close: () => void;
}

const DeleteWindow: FC<Props> = ({ children, remove, cancel, close }) => {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Window close={close}>
      <Container>
        <Message color={th.colors.text}>
          {children}
        </Message>
        <ControlPane
          height={size.tabs.h}
          size={font.size.l}
          controls={[
            {
              key: "ok",
              children: t(d.ui.buttons.ok),
              onClick: remove,
            },
            {
              key: "cancel",
              children: t(d.ui.buttons.cancel),
              onClick: cancel
            }
          ]}
        />
      </Container>
    </Window>
  );
}

export default DeleteWindow;
