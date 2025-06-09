import { FC } from "react";
import { styled } from "@linaria/react";
import SearchBar from "components/common/input/SearchBar";
import UnselectButton from "components/common/button/UnselectButton";
import { font, size } from "styles";

const Container = styled.div`
  width: 100%;
  height: ${size.import.top.h}px;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 5px;
`;

interface Props {
  setQuery: (query: string) => void;
  unselect: () => void;
}

const ImportContactsFormTop: FC<Props> = ({ unselect, setQuery }) => {
  return (
    <Container>
      <SearchBar onQueryChange={setQuery} debounced={true} />
      <UnselectButton unselect={unselect} size={font.size.x4l} />
    </Container>
  );
};

export default ImportContactsFormTop;
