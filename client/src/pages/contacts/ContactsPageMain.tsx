import { FC, useState } from "react";
import ContactsPageTop from "./ContactsPageTop";
import ContactsPageBody from "./ContactsPageBody";

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
