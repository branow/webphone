import { FC, useState } from "react";
import ContactsPageTop from "pages/contacts/view/ContactsPageTop";
import ContactsPageBody from "pages/contacts/view/ContactsPageBody";

const ContactsPageMain: FC<{ user: string }> = ({ user }) => {
  const [query, setQuery] = useState<string>("");

  return (
    <>
      <ContactsPageTop user={user} setQuery={setQuery} />
      <ContactsPageBody user={user} query={query} />
    </>
  );
};

export default ContactsPageMain;
