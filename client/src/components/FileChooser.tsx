import { FC, ChangeEventHandler, RefObject } from "react";

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  onLoadFile: (file: File) => void;
  accept?: string;
}

const FileChooser: FC<Props> = ({ inputRef, onLoadFile, accept }) => {

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = () => {
    if (inputRef && inputRef.current && inputRef.current.files) {
      const file = inputRef.current.files[0];
      onLoadFile(file);
    }
  };

  return (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
  );
};

export default FileChooser;
