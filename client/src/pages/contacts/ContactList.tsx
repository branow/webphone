import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import ContactPreview from "./ContactPreview";
import SearchBar from "../../components/SearchBar";
import PendingTab from "../../components/PendingTab";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import { Contact, QueryKeys, getAll } from "../../services/contacts";
import "./ContactList.css";

const ContactList: FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const { data, isPending, isError, error } = useQuery({
    queryKey: [QueryKeys.contacts],
    queryFn: getAll,
  });

  const handleQueryChange = (query: string) => {
    setQuery(query);
  }

  const searchFilter = (contact: Contact): boolean => {
    const searchQuery = query.toLowerCase();
    return contact.name.toLowerCase().includes(searchQuery)
    || contact.numbers.filter(number => number.number.includes(searchQuery)).length !== 0
    || (contact.bio !== undefined && contact.bio.toLowerCase().includes(searchQuery));
  }

  if (isPending) {
    return <PendingTab text="LOADING" />
  }

  if (isError) {
    return <ErrorMessage error={error ? error.message : ""} />
  }

  return (
    <div className="contact-list-ctn">
      {
        data.length === 0 ? (
          <div>You do not have any contact yet</div>
        ) : (
          <div className="contact-list">
            <div className="contact-list-header">
              <SearchBar onQueryChange={handleQueryChange} />
              <Button
                className="green-btn contact-list-add-btn"
                Icon={FaPlus}
                onClick={() => navigate("/contacts/create")}
              />
            </div>
            <div className="contact-list-body">
              {data.filter(searchFilter).map(contact => (
                <ContactPreview
                  key={contact.id}
                  contact={contact}
                />
              ))}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default ContactList;
