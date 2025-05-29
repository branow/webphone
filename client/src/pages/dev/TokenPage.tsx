import { FC, useState, useEffect } from "react";
import { Auth } from "../../services/auth";

const TokenPage: FC = () => {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    getToken();
  }, []);

  const getToken = () => {
    Auth().ensureAuthentication()
      .then(auth => { console.log(auth.token); setDate(new Date()); });
  }

  return (
    <>
      <p>You Access Token In Console: {date ? date.toTimeString() : ""}</p>
      <button onClick={() => getToken()}>Get Token</button>
    </>
  );
}

export default TokenPage;
