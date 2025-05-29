import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import TransparentRoundButton from "../../components/common/button/TransparentRoundButton";
import { PageSwitcherContext } from "../../context/PageSwitcherContext";
import { useTheme } from "../../hooks/useTheme";
import { d } from "../../lib/i18n";
import { Paths } from "../../routes";
import { font, size } from "../../styles";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${size.setting.top.h}px;
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const cssBackButton = css`
  position: absolute;
  left: 0px;
  font-size: ${font.size.xxl}px;
  padding-right: 5px;
`;

const Title = styled.div<{ color: string }>`
  text-transform: uppercase;
  font-size: ${font.size.l}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const SettingPageTop: FC = () => {
  const { current, previous } = useContext(PageSwitcherContext);
  const navigate = useNavigate();

  const moveBack = () => {
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
      <TransparentRoundButton
        className={cssBackButton}
        onClick={() => moveBack()}
      >
        <IoIosArrowDown />
      </TransparentRoundButton>
      <Title color={th.colors.textDisabled}>
        {t(d.settings.title)}
      </Title>
    </Container>
  );
}

export default SettingPageTop;
