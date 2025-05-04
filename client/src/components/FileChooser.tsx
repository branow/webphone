import { FC, ChangeEventHandler, RefObject } from "react";

interface Trigger {
  fire: () => void;
}

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  trigger: Trigger;
  onLoadFile: (file: File) => void;
  accept?: string;
}

const FileChooser: FC<Props> = ({ inputRef, trigger, onLoadFile, accept }) => {

  trigger.fire = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = () => {
    if (inputRef.current && inputRef.current.files) {
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
