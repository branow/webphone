import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsFillTrash3Fill } from "react-icons/bs";
import HistoryNodes from "./HistoryNodes";
import ErrorMessage from "../../components/ErrorMessage";
import PendingTab from "../../components/PendingTab";
import NavTabs, { Tab } from "../../components/NavTabs";
import HistoryApi from "../../services/history.ts";
import { d } from "../../lib/i18n.ts";
import "./HistoryPage.css";

const HistoryPage: FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const removingAll = useMutation({
    mutationFn: HistoryApi.removeAll,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: HistoryApi.QueryKeys.predicate
      });
    }
  })

  if (removingAll.isPending) {
    return <PendingTab text={t(d.ui.loading.cleaning)} message={t(d.ui.loading.wait)} />;
  }

  if (removingAll.isError) {
    return <ErrorMessage error={removingAll.error} />;
  }

  return (
    <div className="history-page">
      <div className="history-page-header">
        <div className="history-page-title">{t(d.history.title)}</div>
        <button
          className="transparent-btn delete-btn history-page-delete-btn"
          onClick={() => removingAll.mutate()}
        >
          <BsFillTrash3Fill />
        </button>
      </div>
      <div className="history-page-nodes-ctn" ref={scrollRef}>
        <HistoryNodes
          scrollRef={scrollRef}
          queryKey={HistoryApi.QueryKeys.history(50)}
          queryFunc={(page) => HistoryApi.getAll({ number: page, size: 50 })}
        />
      </div>
      <NavTabs tabs={[Tab.CONTACTS, Tab.DIALPAD]} />
    </div>
  );
};

export default HistoryPage;
