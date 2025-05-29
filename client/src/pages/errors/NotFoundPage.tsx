import { FC } from "react";
import {useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import TransparentRectButton from "../../components/common/button/TransparentRectButton";
import { useTheme } from "../../hooks/useTheme";
import { d } from "../../lib/i18n";
import { font } from "../../styles";
import { Paths } from "../../routes";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Header = styled.div<{ color: string }>`
  font-size: ${font.size.xxl}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const Message = styled.div<{ color: string }>`
  font-size: ${font.size.m}px;
  color: ${p => p.color};
`;

const cssButton = css`
  padding: 10px;
  font-size: ${font.size.l}px;
`;

const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const th = useTheme();

  return (
    <Container>
      <Header color={th.colors.redHover}>{t(d.errors.e404.title)}</Header>
      <Message color={th.colors.title}>{t(d.errors.e404.message)}</Message>
      <TransparentRectButton
        className={cssButton}
        onClick={() => navigate(Paths.Dialpad())}
      >
        {t(d.errors.takeMeHome)}
      </TransparentRectButton>
    </Container>
  );
}

export default NotFoundPage;
