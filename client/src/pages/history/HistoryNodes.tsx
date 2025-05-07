import { FC, useState, ReactNode, RefObject } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PendingTab from "../../components/PendingTab";
import ErrorMessage from "../../components/ErrorMessage";
import HistoryNode from "./HistoryNode";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll.ts";
import { Record } from "../../services/history.ts";
import { Page } from "../../services/backend.ts";
import "./HistoryNodes.css";

interface Props {
  scrollRef: RefObject<HTMLDivElement>;
  queryKey: string[];
  queryFunc: (page: number) => Promise<Page<Record>>;
}

const HistoryNodes: FC<Props> = ({ scrollRef, queryKey, queryFunc }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const fetching = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => queryFunc(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.number < lastPage.totalPages ? lastPage.number + 1 : null,
  });

  useInfiniteScroll({
    scrollRef,
    loadFactor: 0.9,
    move: async () => { fetching.fetchNextPage(); }
  });

  const item = (record: Record, index: number, records: Record[]) => {
    let dateMark: ReactNode;
    if (index === 0 || record.startDate.getDate() !== records[index - 1].startDate.getDate()) {
      dateMark = (
        <div className="history-nodes-date">
          {record.startDate.toDateString()}
        </div>
      )
    }

    return (
      <div key={record.id}>
        {dateMark && (dateMark)}
        <HistoryNode
          unrolled={record.id === selectedNodeId}
          record={record}
          unroll={() => setSelectedNodeId(record.id)}
          rollUp={() => setSelectedNodeId(null)}
        />
      </div>
    )
  }

  return (
    <div className="history-nodes">
      {fetching.data && fetching.data.pages.map((page: Page<Record>) =>
        <div key={page.number}>{page.items.map(item)}</div>
      )}
      {fetching.isError && <ErrorMessage error={fetching.error} />}
      {fetching.isLoading && <PendingTab text="LOADING" />}
    </div>
  );
};

export default HistoryNodes;
