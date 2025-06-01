import { FC, useContext, useRef } from "react";
import { styled } from "@linaria/react";
import { useTranslation } from "react-i18next";
import InfinitePages from "../../components/common/motion/InfinitePages";
import CallRecords from "../../components/history/CallRecords";
import BackgroundMessage from "../../components/common/messages/BackgroundMessage";
import HistoryApi from "../../services/history";
import { AccountContext } from "../../context/AccountContext";
import { size } from "../../styles";
import { d } from "../../lib/i18n";

const Container = styled.div`
  height: ${ size.phone.h - size.navbar.h - size.tabs.h - size.history.top.h }px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
`;

const HistoryPageBody: FC = () => {
  const { account } = useContext(AccountContext);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  return (
    <Container ref={scrollRef}>
      {account && (
        <InfinitePages
          scrollRef={scrollRef}
          queryKey={HistoryApi.QueryKeys.history(40)}
          queryFunc={(page) => HistoryApi.getAll(account.user, { number: page, size: 40 })}
        >
          {(records) => <CallRecords records={records} />}
        </InfinitePages>
      )}
      {!account && (
        <BackgroundMessage text={t(d.account.messages.noAccount)} />
      )}
    </Container>
  );
};

export default HistoryPageBody;
