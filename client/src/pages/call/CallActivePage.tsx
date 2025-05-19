import { FC, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../../components/ErrorMessage";
import CallActivePageContent from "./CallActivePageContent";
import CallProvider from "../../providers/CallProvider";
import { d } from "../../lib/i18n";
import "./CallPage.css";

const CallActivePage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) navigate("/home");
  }, [id]);

  if (!id) {
    return <ErrorMessage error={t(d.call.errors.missingId)} />
  }

  return (
    <CallProvider callId={id}>
      <CallActivePageContent />
    </CallProvider>
  );
};




export default CallActivePage;
