import { FC } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BsFillTrash3Fill } from "react-icons/bs";
import { queryClient } from "../../lib/query.ts";
import HistoryNodes from "./HistoryNodes";
import ErrorMessage from "../../components/ErrorMessage";
import PendingTab from "../../components/PendingTab";
import NavTabs, { Tab } from "../../components/NavTabs";
import Button from "../../components/Button";
import HistoryApi, { Node } from "../../services/history.ts";
import ContactsApi, { Contact } from "../../services/contacts.ts";
import "./HistoryPage.css";

const HistoryPage: FC = () => {
  const navigate = useNavigate();

  const gettingAll = useQuery({
    queryKey: [HistoryApi.QueryKeys.history],
    queryFn: HistoryApi.getAll,
  });

  const gettingAllContacts = useQuery({
    queryKey: [ContactsApi.QueryKeys.contacts],
    queryFn: ContactsApi.getAll,
  });

  const removingAll = useMutation({
    mutationFn: HistoryApi.removeAll,
    onSuccess: () => {
      navigate("/history");
      queryClient.invalidateQueries({ queryKey: [HistoryApi.QueryKeys.history] });
    }
  })

  if (gettingAll.isLoading || gettingAllContacts.isLoading) {
    return <PendingTab text="LOADING" message="Please wait" />;
  }

  if (gettingAll.isError) {
    return <ErrorMessage error={gettingAll.error} />
  }

  if (gettingAllContacts.isError) {
    return <ErrorMessage error={gettingAllContacts.error} />
  }

  if (removingAll.isPending) {
    return <PendingTab text="CLEANING" message="Please wait" />;
  }

  if (removingAll.isError) {
    return <ErrorMessage error={removingAll.error} />;
  }

  const nodes: Node[] = gettingAll.data!;
  const contacts: Contact[] = gettingAllContacts.data!;

  return (
    <div className="history-page">
      <div className="history-page-header">
        <div className="history-page-title">HISTORY</div>
        <Button
          className="transparent-btn delete-btn history-page-delete-btn"
          Icon={BsFillTrash3Fill}
          onClick={() => removingAll.mutate()}
        />
      </div>
      <div className="history-page-nodes-ctn">
        <HistoryNodes nodes={nodes} contacts={contacts} />
      </div>
      <NavTabs tabs={[Tab.CONTACTS, Tab.DIALPAD]} />
    </div>
  );
};

export default HistoryPage;
