import { FC } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "../input/TextInput";
import { d } from "../../../lib/i18n";
import { useDebounce } from "../../../hooks/useDebounce";

interface Props {
  onQueryChange: (query: string) => void;
  debounced?: boolean;
}


const SearchBar: FC<Props> = ({ onQueryChange, debounced }) => {
  const { t } = useTranslation();

  let setQuery = onQueryChange;
  if (debounced) {
    setQuery = useDebounce({
      func: onQueryChange,
      timeout: 300
    });
  }

  return (
    <TextInput
      onValueChange={setQuery}
      placeholder={t(d.ui.search.placeholder)}
    />
  );
}

export default SearchBar;
