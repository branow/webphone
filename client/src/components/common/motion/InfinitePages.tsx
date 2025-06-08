import { ReactNode, RefObject } from "react";
import InfiniteList from "components/common/motion/InfiniteList";
import { Page } from "services/backend";

interface Props<T> {
  scrollRef: RefObject<HTMLDivElement>;
  queryKey: string[];
  queryFunc: (page: number) => Promise<Page<T>>;
  children: (data: T[]) => ReactNode;
}

function InfinitePages<T>({ scrollRef, queryKey, queryFunc, children }: Props<T>) {
  return (
    <InfiniteList
      scrollRef={scrollRef}
      queryKey={queryKey}
      queryFunc={queryFunc}
      getNextPageParam={(page) => page.number + 1 < page.totalPages ? page.number + 1 : undefined}
    >
      {(pages) => children(pages.flatMap(page => page.items))}
    </InfiniteList>
  );
};

export default InfinitePages;
