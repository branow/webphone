import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/query.ts";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import ContactPreview from "../ContactPreview";
import { Contact, QueryKeys, getFeatureAll, importContacts } from "../../../services/contacts.ts";
import "./FeatureNumbersPage.css";

const FeatureNumbersPage: FC = () => {
  const navigate = useNavigate();

  const getting = useQuery({
    queryFn: getFeatureAll,
    queryKey: [QueryKeys.features],
  });

  const [selected, setSelected] = useState<Contact[]>([]);
  const [query, setQuery] = useState<string>("");

  const importing = useMutation({
    mutationFn: importContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.contacts] });
      navigate("/contacts");
    }
  });

  const handlePreviewClick = (contact: Contact) => {
    if (selected.includes(contact)) {
      setSelected(selected.filter(c => c.id !== contact.id));
    } else {
      setSelected([ ...selected, contact ]);
    }
  }

  const handleImport = () => {
    importing.mutate(selected);
  }

  const handleCancel = () => navigate(-1);

  const handleQueryChange = (query: string) => {
    setQuery(query);
  }

  const searchFilter = (contact: Contact): boolean => {
    const searchQuery = query.toLowerCase();
    return contact.name.toLowerCase().includes(searchQuery)
    || contact.numbers.filter(number => number.number.includes(searchQuery)).length !== 0
    || (contact.bio !== undefined && contact.bio.toLowerCase().includes(searchQuery));
  }

  if (getting.isError) {
    return <ErrorMessage error={getting.error} />
  }

  if (getting.isLoading) {
    return <PendingTab text="LOADING" message="Please wait" />
  }

  if (importing.isPending) {
    return <PendingTab text="IMPORTING" message="Please wait" />
  }

  const contacts: Contact[] = getting.data!;

  return (
    <div className="feature-numbers-page">
      <div className="feature-number-search">
        <SearchBar onQueryChange={handleQueryChange} />
      </div>
      <div className="feature-numbers">
        <ErrorMessage error={importing.error} />
        {contacts.filter(searchFilter).map(contact => (
          <div key={contact.id} className="feature-number-row">
            <input
              className="contact-checkbox"
              type="checkbox"
              checked={selected.includes(contact)}
              onChange={() => {}}
            />
            <div className="feature-number-contact">
              <ContactPreview
                contact={contact}
                onClick={() => handlePreviewClick(contact)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="feature-numbers-ctrls">
        <Button
          className="feature-numbers-ctrl-btn"
          text="IMPORT"
          onClick={handleImport}
          disabled={selected.length === 0}
        />
        <Button
          className="feature-numbers-ctrl-btn"
          text="CANCEL"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
}

export default FeatureNumbersPage;
