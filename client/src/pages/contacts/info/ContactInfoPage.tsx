import { FC, useState, useRef } from "react";
import { useNavigate, useParams} from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import Photo from "../../../components/Photo";
import Button from "../../../components/Button";
import PendingTab from "../../../components/PendingTab";
import ErrorMessage from "../../../components/ErrorMessage";
import NotFoundPage from "../../errors/NotFoundPage";
import Chapter from "./Chapter";
import ChapterBar from "./ChapterBar";
import DeleteContactWindow from "../DeleteContactWindow";
import ContactNumbers from "../ContactNumbers";
import HistoryNodes from "../../history/HistoryNodes";
import ContactApi from "../../../services/contacts.ts";
import HistoryApi from "../../../services/history.ts";
import "./ContactInfoPage.css";

const ContactInfoPage: FC = () => {
  const params = useParams<{ id: string }>();
  const contactId: string = params.id || "";

  if (!contactId) {
    return <NotFoundPage />
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchingContact = useQuery({
    queryKey: ContactApi.QueryKeys.contact(contactId),
    queryFn: () => ContactApi.get(contactId),
  })

  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  const removingContact = useMutation({
    mutationFn: () => ContactApi.remove(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: ContactApi.QueryKeys.predicate });
      queryClient.invalidateQueries({ predicate: HistoryApi.QueryKeys.predicate });
      navigate("/contacts");
    }
  });

  const call = (number: string) => navigate(`/call/${number}`);

  const handleDelete = () => removingContact.mutate()

  const handleDeleteIntend = () => setIsConfirmingDelete(true);

  const handleEdit = () => navigate(`/contacts/update/${contact.id}`);

  if (fetchingContact.isError) {
    return (<ErrorMessage error={fetchingContact.error}/>);
  }

  if (fetchingContact.isPending) {
    return (<PendingTab text="FETCHING" message="Please wait" />);
  }

  if (removingContact.isPending) {
    return (<PendingTab text="DELETING" message="Please wait" />);
  }

  const contact = fetchingContact.data!;

  return (
    <div className="contact-info-ctn">
      {isConfirmingDelete && (
        <DeleteContactWindow
          contactName={contact.name}
          close={() => setIsConfirmingDelete(false)}
          deleteContact={handleDelete}
        />
      )}
      <div className="contact-info-top">
        <div className="contact-info-top-left">
          <Button
            className="transparent-btn contact-info-back-btn"
            Icon={IoIosArrowBack}
            onClick={() => navigate("/contacts")}
          />
        </div>
        <div className="contact-info-top-right">
          <Button
            className="transparent-btn contact-info-edit-btn"
            Icon={MdEdit}
            onClick={handleEdit}
          />
          <Button
            className="transparent-btn delete-btn contact-info-delete-btn"
            Icon={BsFillTrash3Fill}
            onClick={handleDeleteIntend}
          />
        </div>
      </div>

      <div className="contact-info" ref={scrollRef}>
        <Chapter>
          <div className="contact-info-header">
            <Photo photo={contact.photo} size={100} alt={contact.name} />
            <div className="contact-info-header-name">{contact.name}</div>
          </div>
        </Chapter>

        <ChapterBar />

        <Chapter title="Bio">
          <div>{contact.bio}</div>
        </Chapter>

        <ChapterBar />

        <Chapter title="Contact">
          <ContactNumbers numbers={contact.numbers} call={call} />
        </Chapter>

        <ChapterBar />

        <Chapter title="History">
          <HistoryNodes
            scrollRef={scrollRef}
            queryKey={HistoryApi.QueryKeys.historyByContact(contactId, 10)}
            queryFunc={(page) => HistoryApi.getAllByContact(contactId, { number: page, size: 10 })}
          />
        </Chapter>

      </div>
    </div>
  );
}

export default ContactInfoPage;
