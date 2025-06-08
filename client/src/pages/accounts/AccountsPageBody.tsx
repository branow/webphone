import { FC, useRef } from "react";
import { styled } from "@linaria/react";
import InfinitePages from "components/common/motion/InfinitePages";
import Accounts from "components/account/Accounts";
import AccountApi from "services/accounts";
import { size } from "styles";

const Container = styled.div`
  height: ${size.phone.h - size.navbar.h - size.tabs.h - size.contacts.top.h}px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
`;

interface Props {
  query: string;
}

const AccountsPageBody: FC<Props> = ({ query }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Container ref={scrollRef}>
      <InfinitePages
        scrollRef={scrollRef}
        queryKey={AccountApi.QueryKeys.accounts(query, 25)}
        queryFunc={(page) => AccountApi.getAll({ query: query, number: page, size: 25 })}
      >
        {accounts => <Accounts accounts={accounts} />}
      </InfinitePages>
    </Container>
  )
};

export default AccountsPageBody;
