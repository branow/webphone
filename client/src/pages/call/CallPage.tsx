import { FC, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import PendingPane from "components/common/motion/PendingPane";
import NotFoundPage from "pages/errors/NotFoundPage";
import { SipContext } from "context/SipContext";
import { d } from "lib/i18n";
import { Paths } from "routes";

const CallPage: FC = () => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();
  const { calls, connection, makeCall } = useContext(SipContext);

  useEffect(() => {
    if (!connection.isConnected()) {
      navigate(Paths.Dialpad());
      return;
    }
    if (number) {
      makeCall( number);
    }
  }, [connection.isConnected, number]);

  useEffect(() => {
    const call = calls.find(c => !c.state.isEnded() && c.number === number);
    if (call) {
      navigate(Paths.CallActive({ id: call.id }));
    }
  }, [calls]);

  const { t } = useTranslation();

  return (
    <>
      {number && (
        <PendingPane
          label={t(d.ui.loading.calling)}
          message={t(d.ui.loading.wait)}
        />
      )}
      {!number && <NotFoundPage />}
    </>
  );
};

export default CallPage;
