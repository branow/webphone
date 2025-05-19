import { FC, useState, useRef } from "react";
import { useNavigate, useParams} from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import Photo from "../../../components/Photo";
import PendingTab from "../../../components/PendingTab";
import ErrorMessage from "../../../components/ErrorMessage";
import Chapter from "./Chapter";
import ChapterBar from "./ChapterBar";
import DeleteContactWindow from "../DeleteContactWindow";
import ContactNumbers from "../ContactNumbers";
import HistoryNodes from "../../history/HistoryNodes";
import ContactApi from "../../../services/contacts";
import HistoryApi from "../../../services/history";
import { d } from "../../../lib/i18n";
import "./ContactInfoPage.css";

const ContactInfoPage: FC = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const contactId: string = params.id!;

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
    return (<PendingTab text={t(d.ui.loading.loading)} message={t(d.ui.loading.wait)} />);
  }

  if (removingContact.isPending) {
    return (<PendingTab text={t(d.ui.loading.deleting)} message={t(d.ui.loading.wait)} />);
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
          <button
            className="transparent-btn contact-info-back-btn"
            onClick={() => navigate("/contacts")}
          >
            <IoIosArrowBack />
          </button>
        </div>
        <div className="contact-info-top-right">
          <button
            className="transparent-btn contact-info-edit-btn"
            onClick={handleEdit}
          >
            <MdEdit />
          </button>
          <button
            className="transparent-btn delete-btn contact-info-delete-btn"
            onClick={handleDeleteIntend}
          >
            <BsFillTrash3Fill />
          </button>
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

        <Chapter title={t(d.contact.fields.bio)}>
          <div>{contact.bio}</div>
        </Chapter>

        <ChapterBar />

        <Chapter title={t(d.contact.fields.contact)}>
          <ContactNumbers numbers={contact.numbers} call={call} />
        </Chapter>

        <ChapterBar />

        <Chapter title={t(d.contact.fields.history)}>
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
