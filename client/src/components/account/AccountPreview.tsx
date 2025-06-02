import { FC } from "react";
import { styled } from "@linaria/react";
import { useTheme } from "../../hooks/useTheme";
import { Account } from "../../services/accounts";
import { font } from "../../styles";

const Container = styled.div<{ border: string }>`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border-right: 5px solid ${p => p.border};
`;

const User = styled.div<{ color: string }>`
  font-size: ${font.size.s}px;
  text-align: center;
  color: ${p => p.color};
`;

const Name = styled.div<{ color: string }>`
  font-size: ${font.size.m}px;
  color: ${p => p.color};
`

const Sip = styled.div<{ color: string }>`
  font-size: ${font.size.s}px;
  color: ${p => p.color};
`;

interface Props {
  account: Account,
  onClick?: () => void,
}

const AccountPreview: FC<Props> = ({ account }) => {
  const th = useTheme();

  return (
    <Container border={ account.active ? th.colors.yellow : th.colors.bgDisabled }>
      <User color={th.colors.title}>{account.user}</User>
      <Name color={th.colors.text}>{account.username}</Name>
      <Sip color={th.colors.title}>
        {account.sip.username}@{account.sip.domain}
      </Sip>
    </Container>
  );
}

export default AccountPreview;
