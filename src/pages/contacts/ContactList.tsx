import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ContactPreview from "./ContactPreview";
import SearchBar from "../../components/SearchBar";
import PendingTab from "../../components/PendingTab";
import ErrorMessage from "../../components/ErrorMessage";
import { Contact, QueryKeys, getAll } from "../../services/contacts";
import "./ContactList.css";

const ContactList: FC = () => {
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
    <div className="contact-list">
      {
        data.length === 0 ? (
          <div>You do not have any contact yet</div>
        ) : (
          <div className="contact-list-contacts">
            <SearchBar onQueryChange={handleQueryChange} />
            <div className="contact-list-contacts-ctn">
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
