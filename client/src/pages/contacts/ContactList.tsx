import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import ContactPreview from "./ContactPreview";
import PendingTab from "../../components/PendingTab";
import ErrorMessage from "../../components/ErrorMessage";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { Page } from "../../services/backend";
import { Contact } from "../../services/contacts";
import { d } from "../../lib/i18n";
import "./ContactList.css";

interface Props {
  queryKey: string[]
  queryFunc: (page: number) => Promise<Page<Contact>>
}

const ContactList: FC<Props> = ({ queryKey, queryFunc }) => {

  const { t } = useTranslation();

  const fetching = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => queryFunc(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.number < lastPage.totalPages ? lastPage.number + 1 : null,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll({
    scrollRef: scrollRef,
    loadFactor: 0.9,
    move: async () => { fetching.fetchNextPage(); }
  });

  const data = fetching.data;

  return (
    <div className="contact-list-body" ref={scrollRef}>
      {data && data.pages.map(page => (
        <div key={page.number}>
          {page.items.map(contact => (
            <ContactPreview
              key={contact.id}
              contact={contact}
            />
          ))}
        </div>
      ))}
      {fetching.isError && <ErrorMessage error={fetching.error} />}
      {fetching.isLoading && <PendingTab text={t(d.ui.loading.loading)} />}
    </div>
  );
}

export default ContactList;
