import { FC } from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import TransparentRectButton from "components/common/button/TransparentRectButton";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

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
  text-align: center;
  font-size: ${font.size.xxl}px;
  font-weight: bold;
  color: ${p => p.color};
`;

const Message = styled.div<{ color: string }>`
  text-align: center;
  font-size: ${font.size.m}px;
  color: ${p => p.color};
`;

const cssButton = css`
  text-align: center;
  padding: 10px;
  font-size: ${font.size.l}px;
`;

interface Props {
  title: string;
  message: string;
  action: string;
  actionFn: () => void;
}

const AccountNotFoundPage: FC<Props> = ({ title, message, action, actionFn }) => {
  const th = useTheme();

  return (
    <Container>
      <Header color={th.colors.redHover}>{title}</Header>
      <Message color={th.colors.title}>{message}</Message>
      <TransparentRectButton
        className={cssButton}
        onClick={actionFn}
      >
        {action}
      </TransparentRectButton>
    </Container>
  );
};

export default AccountNotFoundPage;
