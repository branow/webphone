import { FC, ChangeEventHandler, RefObject } from "react";

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  onFiles: (file: File[]) => void;
  accept?: string;
}

const FileInput: FC<Props> = ({ inputRef, onFiles, accept }) => {
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = () => {
    if (inputRef && inputRef.current && inputRef.current.files) {
      const fileList = inputRef.current.files;
      const files = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        if (file) files.push(file);
      }
      onFiles(files);
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

export default FileInput;
