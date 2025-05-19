import { FC } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "./TextInput";
import { d } from "../lib/i18n";
import "./SearchBar.css";

interface Props {
  onQueryChange: (text: string) => void;
}

const SearchBar: FC<Props> = ({ onQueryChange }) => {
  const { t } = useTranslation();

  return (
    <TextInput
      className="search-bar"
      placeholder={t(d.ui.search.placeholder)}
      onValueChange={onQueryChange}
    />
  );
}

export default SearchBar;
