import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import DeleteButton from "components/common/button/DeleteButton";
import { useTheme } from "hooks/useTheme";
import { d } from "lib/i18n";
import { font, size } from "styles";

const Container = styled.div`
  position: relative;
  height: ${size.tabs.h}px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div<{ color: string }>`
  text-transform: uppercase;
  font-size: ${font.size.xl}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const CleanButtonContainer = styled.div`
  position: absolute;
  right: 5px;
`;

interface Props {
  clean: () => void;
  cleanDisabled?: boolean;
}

const HistoryPageTop: FC<Props> = ({ clean, cleanDisabled }) => {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Container>
      <Title color={th.colors.textDisabled}>{t(d.history.title)}</Title>
      <CleanButtonContainer>
        <DeleteButton
          action={clean}
          size={font.size.x4l}
          disabled={cleanDisabled}
        />
      </CleanButtonContainer>
    </Container>
  );
};

export default HistoryPageTop;
