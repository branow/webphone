import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { styled } from "@linaria/react";
import DeleteButton from "../common/button/DeleteButton";
import CallButton from "../call/CallButton";
import RecordUnrolledContent from "./RecordUnrolledContent";
import { SipContext } from "../../context/SipContext";
import { AccountContext } from "../../context/AccountContext";
import HistoryApi, { Record } from "../../services/history";
import { extractPhoneNumber } from "../../util/format";
import { Paths } from "../../routes";

const Container = styled.div`
  position: relative;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const DeleteButtonContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
`;

const CallButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface Props {
  record: Record;
}

const RecordUnrolled: FC<Props> = ({ record }) => {
  const navigate = useNavigate();
  const { account } = useContext(AccountContext);
  const { connection } = useContext(SipContext);
  const queryClient = useQueryClient();

  const removing = useMutation({
    mutationFn: HistoryApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: HistoryApi.QueryKeys.predicate });
    }
  });

  const remove = () => {
    removing.mutate(record.id);
  }

  const call = () => {
    navigate(Paths.Call({ number: extractPhoneNumber(record.number) }));
  }

  return (
    <Container>
      <DeleteButtonContainer>
        <DeleteButton size={18} remove={remove} disabled={account?.isDefault} />
      </DeleteButtonContainer>
      <RecordUnrolledContent record={record} />
      <CallButtonContainer>
        <CallButton
          size={40}
          onClick={() => call()}
          disabled={!connection.isConnected()}
        />
      </CallButtonContainer>
    </Container>
  );
};

export default RecordUnrolled;
