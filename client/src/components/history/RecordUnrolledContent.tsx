import { FC } from "react";
import { styled } from "@linaria/react";
import Photo from "../../components/contact/photo/Photo";
import RecordUnrolledContentInfo from "./RecordUnrolledContentInfo";
import { Record } from "../../services/history";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

interface Props {
  record: Record;
}

const RecordUnrolledContent: FC<Props> = ({ record }) => {
  return (
    <Container>
      <Photo src={record.contact?.photo} size={60} />
      <RecordUnrolledContentInfo record={record} />
    </Container>
  );
};

export default RecordUnrolledContent;
