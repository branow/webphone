import { FC, useState, useRef, useEffect, useContext, ChangeEventHandler, MouseEventHandler } from "react";
import { BsPersonFill, BsKeyFill, BsEraserFill, BsCloudUploadFill } from "react-icons/bs";
import TextInput from "../../components/TextInput";
import FileChooser from "../../components/FileChooser";
import ErrorMessage from "../../components/ErrorMessage";
import { SipContext } from "../../context/SipContext";
import { SipAccount } from "../../lib/sip";
import "./SipAccountForm.css";

const SipAccountForm: FC = () => {
  const { account, setAccount, connectionError } = useContext(SipContext);
  const [error, setError] = useState(connectionError);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError(connectionError);
  }, [connectionError]);

  const [localAccount, setLocalAccount] = useState<SipAccount>(
    account || { username: "", password: "", domain: "" }
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const name = event.target.name as keyof SipAccount;
    setLocalAccount({ ...localAccount, [name]: event.target.value });
    setError("");
  };

  const handleSave: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setAccount({ ...localAccount });
  };

  const handleClean: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setLocalAccount({
      username: "",
      password: "",
      domain: "",
    });
    setError("");
  };

  const fileTrigger = { fire: () => {} };

  const handleFileSelector: MouseEventHandler<HTMLButtonElement> 
    = (event) => {
    event.preventDefault();
    fileTrigger.fire();
  };

  const handleLoadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        const jsonData = e.target.result as string;
        try {
          const data = JSON.parse(jsonData);
          setLocalAccount(data);
          setError("");
        } catch (e) {
          setError("Invalid Json");
          console.warn(e);
        }
      } else {
        setError("Empty file");
      }
    }
    reader.onerror = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        setError(error);
      } else {
        setError("Empty file");
      }
    }
    reader.readAsText(file);
  }

  const validateInput = (name: string, value: string): string => {
    if (!value || !(value.trim())) return `${name} is mandatory`;
    return "";
  }

  const accountIsValid = (): boolean => {
    return !validateInput("", localAccount.username)
      && !validateInput("", localAccount.password)
      && !validateInput("", localAccount.domain);
  }

  return (
    <form className="sip-account-form">
      <ErrorMessage className="sip-account-form-error" error={error} />
      <div className="sip-account-form-control-con">
        <button
          className="upload sip-account-form-control transparent-btn"
          onClick={handleFileSelector}
        >
          <BsCloudUploadFill />
        </button>
        <button
          className="erase sip-account-form-control transparent-btn"
          onClick={handleClean}
        >
          <BsEraserFill />
        </button>
      </div>
      <FileChooser inputRef={fileInputRef} trigger={fileTrigger} onLoadFile={handleLoadFile}/>
      <TextInput
        className="sip-account-form-text-in"
        Icon={BsPersonFill}
        label="User"
        name="username"
        value={localAccount.username}
        onChange={handleChange}
        validate={(input) => validateInput("Username", input)}
      />
      <TextInput
        className="sip-account-form-text-in"
        Icon={BsKeyFill}
        label="Password"
        name="password"
        value={localAccount.password}
        onChange={handleChange}
        validate={(input) => validateInput("Password", input)}
      />
      <TextInput
        className="sip-account-form-text-in"
        label="Domain"
        name="domain"
        value={localAccount.domain}
        onChange={handleChange}
        validate={(input) => validateInput("Domain", input)}
      />
      <div className="sip-account-form-save-btn-ctn">
        <button
          className="sip-account-form-save-btn"
          onClick={handleSave}
          disabled={!accountIsValid()}
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default SipAccountForm;
