import { FC, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ErrorMessage from "../../components/ErrorMessage";
import CallActivePageContent from "./CallActivePageContent";
import CallProvider from "../../providers/CallProvider";
import "./CallPage.css";

const CallActivePage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) navigate("/home");
  }, [id]);

  if (!id) {
    return <ErrorMessage error="Unexpected error occured." />
  }

  return (
    <CallProvider callId={id}>
      <CallActivePageContent />
    </CallProvider>
  );
};




export default CallActivePage;
