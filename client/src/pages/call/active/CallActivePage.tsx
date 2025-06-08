import { FC } from "react";
import { useParams } from "react-router";
import CallActivePageContent from "pages/call/active/CallActivePageContent";
import NotFoundPage from "pages/errors/NotFoundPage";
import CallProvider from "providers/CallProvider";

const CallActivePage: FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFoundPage />
  }

  return (
    <CallProvider callId={id}>
      <CallActivePageContent />
    </CallProvider>
  );
};

export default CallActivePage;
