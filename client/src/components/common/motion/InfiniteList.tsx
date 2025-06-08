import { ReactNode, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import FadeMotion from "./FadeMotion";
import PendingPane from "./PendingPane";
import ErrorBanner from "../messages/ErrorBanner";
import AutoHeightMotion from "./AutoHeightMotion";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { d } from "../../../lib/i18n";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 50px;
`;

interface Props<T> {
  scrollRef: RefObject<HTMLDivElement>;
  queryKey: string[];
  queryFunc: (page: number) => Promise<T>;
  getNextPageParam: (page: T) => number | undefined;
  children: (pages: T[]) => ReactNode;
}

function InfiniteList<T>({ scrollRef, queryKey, queryFunc, getNextPageParam, children } : Props<T>) {
  const { t } = useTranslation();

  const {
    data,
    error,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => queryFunc(pageParam),
    initialPageParam: 0,
    getNextPageParam: getNextPageParam,
  });

  useInfiniteScroll({
    scrollRef: scrollRef,
    loadFactor: 0.9,
    next: async () => {
      if (hasNextPage && !isFetchingNextPage && !error) fetchNextPage();
    },
    hasNext: hasNextPage,
  });

  return (
    <Container>
      <AnimatePresence mode="wait">
        {isPending && (
          <PendingPane
            key="pending"
            label={t(d.ui.loading.loading)}
            message={t(d.ui.loading.wait)} />
        )}
        {!isPending && (
          <>
            {!error && data && (
              <FadeMotion key="records">
                <AutoHeightMotion duration={1}>
                  {children(data.pages)}
                  {hasNextPage && (
                    <LoadingContainer>
                      <PendingPane key="pending" label={t(d.ui.loading.loading)} />
                    </LoadingContainer>
                  )}
                </AutoHeightMotion>
              </FadeMotion>
            )}
            {error && <ErrorBanner key="error" error={error} />}
          </>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default InfiniteList;
