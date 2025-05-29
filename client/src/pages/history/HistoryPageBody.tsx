import { FC, useRef } from "react";
import { styled } from "@linaria/react";
import InfinitePages from "../../components/common/motion/InfinitePages";
import CallRecords from "../../components/history/CallRecords";
import HistoryApi from "../../services/history";
import { size } from "../../styles";

const Container = styled.div`
  height: ${ size.phone.h - size.navbar.h - size.tabs.h - size.history.top.h }px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
`;

const HistoryPageBody: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Container ref={scrollRef}>
      <InfinitePages
        scrollRef={scrollRef}
        queryKey={HistoryApi.QueryKeys.history(40)}
        queryFunc={(page) => HistoryApi.getAll({ number: page, size: 40 })}
      >
        {(records) => <CallRecords records={records} />}
      </InfinitePages>
    </Container>
  );
};

export default HistoryPageBody;
