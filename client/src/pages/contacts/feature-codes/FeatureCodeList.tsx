import { FC } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ErrorMessage from "../../../components/ErrorMessage";
import PendingTab from "../../../components/PendingTab";
import ContactPreview from "../ContactPreview";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { Page } from "../../../services/backend";
import { Contact } from "../../../services/contacts";
import "./FeatureCodeList.css";

interface Prop {
  queryKey: string[];
  queryFunc: (page: number) => Promise<Page<Contact>>;
  isSelected: (contact: Contact) => boolean;
  select: (contact: Contact) => void;
  unselect: (contact: Contact) => void;
}

const FeatureCodeList: FC<Prop> = ({ queryKey, queryFunc, isSelected, select, unselect }) => {
  const fetching = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => queryFunc(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.number < lastPage.totalPages ? lastPage.number + 1 : null,
  });

  const { scrollRef } = useInfiniteScroll({
    loadFactor: 0.8,
    move: fetching.fetchNextPage
  });

  const handlePreviewClick = (contact: Contact) => {
    isSelected(contact) ? unselect(contact) : select(contact);
  }

  return (
    <div className="feature-numbers" ref={scrollRef}>
      {fetching.data && fetching.data.pages.map((page: Page<Contact>) => 
        <div key={page.number}>{page.items.map(contact => (
          <div key={contact.id} className="feature-number-row">
            <input
              className="contact-checkbox"
              type="checkbox"
              checked={isSelected(contact)}
              onChange={() => {}}
            />
            <div className="feature-number-contact">
              <ContactPreview
                contact={contact}
                onClick={() => handlePreviewClick(contact)}
              />
            </div>
          </div>
        ))}</div>
      )}
      {fetching.isError && <ErrorMessage error={fetching.error} />}
      {fetching.isLoading && <PendingTab text="LOADING" />}
    </div>
  );
}

export default FeatureCodeList;
