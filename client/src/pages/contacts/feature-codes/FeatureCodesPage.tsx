import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import SearchBar from "../../../components/SearchBar";
import ContactApi, { Contact } from "../../../services/contacts.ts";
import "./FeatureCodesPage.css";
import FeatureCodeList from "./FeatureCodeList.tsx";

const FeatureCodesPage: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<Contact[]>([]);

  const importing = useMutation({
    mutationFn: ContactApi.createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ContactApi.QueryKeys.contacts });
      navigate("/contacts");
    }
  });

  const isSelected = (contact: Contact) => selected.includes(contact);

  const select = (contact: Contact) => setSelected((selected) => [ ...selected, contact ]); 

  const unselect = (contact: Contact) => setSelected((selected) => selected.filter(c => c.id !== contact.id));

  const handleImport = () => {
    importing.mutate(selected);
  }

  const handleCancel = () => navigate(-1);

  const handleQueryChange = (query: string) => {
    setQuery(query);
  }

  if (importing.isPending) {
    return <PendingTab text="IMPORTING" message="Please wait" />
  }

  return (
    <div className="feature-numbers-page">
      <div className="feature-number-search">
        <SearchBar onQueryChange={handleQueryChange} />
      </div>
      <ErrorMessage error={importing.error} />
      <FeatureCodeList
        queryKey={ContactApi.QueryKeys.featureCodes(query)}
        queryFunc={(page) => ContactApi.getFeatureCodes({ query: query, number: page, size: 25 })}
        isSelected={isSelected}
        select={select}
        unselect={unselect}
      />
      <div className="feature-numbers-ctrls">
        <button
          className="feature-numbers-ctrl-btn"
          onClick={handleImport}
          disabled={selected.length === 0}
        >
          IMPORT
        </button>
        <button
          className="feature-numbers-ctrl-btn"
          onClick={handleCancel}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}

export default FeatureCodesPage;
