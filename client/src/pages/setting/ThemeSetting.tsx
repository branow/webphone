import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import ThemeToggler from "pages/setting/ThemeToggler";
import { useTheme } from "hooks/useTheme";
import { d } from "lib/i18n";
import { font } from "styles";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${font.size.m}px;
`;

const Label = styled.div<{ color: string }>`
  color: ${p => p.color}
`;

const ThemeSetting: FC = () => {
  const { t } = useTranslation();
  const th = useTheme();

  return (
    <Container>
      <Label color={th.colors.text}>{t(d.settings.theme)}</Label>
      <ThemeToggler />
    </Container>
  );
}

export default ThemeSetting;
