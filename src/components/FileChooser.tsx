import { FC, useRef, ChangeEventHandler } from "react";

interface Trigger {
  fire: () => void;
}

interface Props {
  trigger: Trigger;
  onLoadFile: (file: File) => void;
  accept?: string;
}

const FileChooser: FC<Props> = ({ trigger, onLoadFile, accept }) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
    <>
      <input 
        type="file"
        accept={accept}
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default FileChooser;
