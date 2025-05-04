import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus } from "react-icons/fa";
import NavTabs, { Tab } from "../../components/NavTabs";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import ContactList from "./ContactList";
import { useDebounce } from "../../hooks/useDebounce";
import ContactApi from "../../services/contacts";
import "./ContactsPage.css";

const ContactsPage: FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const debouncedSetQuery = useDebounce({
    func: setQuery,
    timeout: 300
  });

  return (
    <div className="contacts-page">
      <div className="contact-list-ctn">
        <div className="contact-list">
          <div className="contact-list-header">
            <SearchBar onQueryChange={debouncedSetQuery} />
            <Button
              className="green-btn contact-list-add-btn"
              Icon={FaPlus}
              onClick={() => navigate("/contacts/create")}
            />
          </div>
          <ContactList
            queryKey={ContactApi.QueryKeys.contacts(query, 25)}
            queryFunc={(page) => ContactApi.getAll({ query: query, number: page, size: 25 })}
          />
        </div>
      </div>
      <NavTabs tabs={[Tab.DIALPAD, Tab.HISTORY]} />
    </div>
  )
};

export default ContactsPage;

