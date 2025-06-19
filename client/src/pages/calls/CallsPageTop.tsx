import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";
import { PageSwitcherContext } from "context/PageSwitcherContext";
import { d } from "lib/i18n";
import { Paths } from "routes";
import { font, size } from "styles";
import ArrowDownButton from "components/common/button/ArrowDownButton";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${size.calls.top.h}px;
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  position: absolute;
  left: 10px;
`;

const Title = styled.div<{ color: string }>`
  text-transform: uppercase;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const CallsPageTop: FC = () => {
  const { current, previous } = useContext(PageSwitcherContext);
  const navigate = useNavigate();

  const back = () => {
    if (previous && previous.location !== current.location) {
      navigate(-1);
    } else {
      navigate(Paths.Dialpad());
    }
  }

  const { t } = useTranslation();
  const th = useTheme();

  return (
    <Container>
      <ButtonContainer>
        <ArrowDownButton
          action={() => back()}
          size={font.size.x4l}
        />
      </ButtonContainer>
      <Title color={th.colors.textDisabled}>
        {t(d.calls.title)}
      </Title>
    </Container>
  );
}

export default CallsPageTop;
