import { FC, ChangeEventHandler } from "react";
import TextInput from "./TextInput";
import "./SearchBar.css";

interface Props {
  onQueryChange: (text: string) => void;
}

const SearchBar: FC<Props> = ({ onQueryChange }) => {

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const query = event.target.value;
    onQueryChange(query);
  } 

  return (
    <TextInput
      className="search-bar"
      placeholder="Search..."
      onChange={handleChange}
    />
  );
}

export default SearchBar;
