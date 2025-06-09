import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import SearchBar from "components/common/input/SearchBar";
import AddButton from "components/common/button/AddButton";
import ImportButton from "components/common/button/ImportButton";
import { AccountContext } from "context/AccountContext";
import { useFetchActiveDefaultAccount } from "hooks/fetch";
import { font, size } from "styles";
import { Paths } from "routes";

const Container = styled.div`
  width: 100%;
  height: ${size.contacts.top.h}px;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
`;

interface Props {
  user: string;
  setQuery: (query: string) => void;
}

const ContactsPageTop: FC<Props> = ({ user, setQuery }) => {
  const navigate = useNavigate();
  const { account } = useContext(AccountContext);

  const fetchingDefaultAccount = useFetchActiveDefaultAccount();
  const defaultAccount = fetchingDefaultAccount.account;

  return (
    <Container>
      <SearchBar onQueryChange={setQuery} debounced={true} />
      {user !== "default" && (
        <ImportButton
          size={font.size.x4l}
          disabled={!account || account?.isDefault || !defaultAccount}
          action={() => navigate(Paths.ContactsImport({ user: "default" }))}
        />
      )}
      <AddButton
        size={font.size.x4l}
        disabled={!account || account?.isDefault}
        action={() => navigate(Paths.ContactCreate({ user }))}
      />
    </Container>
  )
};

export default ContactsPageTop;

