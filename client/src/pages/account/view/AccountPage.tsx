import { FC, useContext } from "react";
import { matchPath, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import FadeMotion from "../../../components/common/motion/FadeMotion";
import ErrorBanner from "../../../components/common/messages/ErrorBanner";
import TransparentRectButton from "../../../components/common/button/TransparentRectButton";
import PendingPane from "../../../components/common/motion/PendingPane";
import NotFoundPage from "../../errors/NotFoundPage";
import { PageSwitcherContext } from "../../../context/PageSwitcherContext";
import AccountApi from "../../../services/accounts";
import { d } from "../../../lib/i18n";
import AccountPageContent from "./AccountPageContent";

const AccountPage: FC = () => {
  const params = useParams<{ id: string }>();
  const { previous } = useContext(PageSwitcherContext);
  let id = params.id;

  if (!id && previous) {
    const match = matchPath({ path: previous.path }, previous.location);
    id = match?.params?.id;
  }

  if (!id) return <NotFoundPage />;

  return <AccountFetchingPage id={id} />;
}

export default AccountPage;

const AccountFetchingPage: FC<{ id: string }> = ({ id }) => {

  const { data, isPending, error } = useQuery({
    queryKey: AccountApi.QueryKeys.account(id),
    queryFn: () => AccountApi.get(id),
    enabled: !!id,
  })

  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      {data && (
        <FadeMotion key="contact">
          <AccountPageContent account={data} />
        </FadeMotion>
      )}
      {error && (
        <FadeMotion key="error">
          <ErrorBanner error={error} />
          <TransparentRectButton>
            {t(d.errors.takeMeHome)}
          </TransparentRectButton>
        </FadeMotion>
      )}
      {isPending && (
        <PendingPane
          label={t(d.ui.loading.loading)}
          message={t(d.ui.loading.wait)}
        />
      )}
    </AnimatePresence>
  );
}

