import { FC, useState } from "react";
import { styled } from "@linaria/react";
import AdminNavTabs, { Tab } from "../../components/navtabs/AdminNavTabs";
import AccountsPageTop from "./AccountsPageTop";
import AccountsPageBody from "./AccountsPageBody";

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const AccountsPage: FC = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <Container>
      <AccountsPageTop setQuery={setQuery} />
      <AccountsPageBody query={query} />
      <AdminNavTabs tabs={[Tab.Admin]} />
    </Container>
  )
};

export default AccountsPage;

