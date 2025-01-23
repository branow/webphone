import { 
  FC,
  useState,
  useEffect,
  useContext,
  ChangeEventHandler,
  MouseEventHandler,
} from "react";
import { 
  BsPersonFill, 
  BsKeyFill,
  BsEraserFill,
  BsCloudUploadFill
} from "react-icons/bs";
import TextInput from "../TextInput";
import Button from "../Button";
import FileChooser from "../FileChooser";
import Error from "../ErrorMessage";
import { SipAccount, SipContext } from "./SipProvider";
import "./SipAccountForm.css";

interface Props {}

const SipAccountForm: FC<Props> = ({}) => {
  const { sipAccount, register, registrationFailed, connectionFailed } 
    = useContext(SipContext)!;
  const [localSipAccount, setLocalSipAccount] = useState<SipAccount>(
    sipAccount || { username: "", password: "", domain: "", proxy: "" }
  );
  const [error, setError] = useState<string>(registrationFailed);

  useEffect(() => {
    setLocalSipAccount(
      sipAccount || { username: "", password: "", domain: "", proxy: "" }
    );
  }, [sipAccount]);

  useEffect(() => {
    setError(registrationFailed || connectionFailed);
  }, [registrationFailed, connectionFailed]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const name = event.target.name as keyof SipAccount;
    setError("");
    setLocalSipAccount({ ...localSipAccount, [name]: event.target.value });
  };

  const handleSave: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    register(localSipAccount);
  };

  const handleClean: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setError("");
    setLocalSipAccount({
      username: "",
      password: "",
      domain: "",
      proxy: "",
    });
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
          setLocalSipAccount(data);
          setError("");
        } catch (error) {
          setError("Invalid Json");
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

  return (
    <form className="sip-account-form">
      <Error className="sip-account-form-error" error={error} />
      <div className="sip-account-form-control-con">
        <Button
          className="upload sip-account-form-control transparent-btn"
          Icon={BsCloudUploadFill}
          onClick={handleFileSelector}
        />
        <Button
          className="erase sip-account-form-control transparent-btn"
          Icon={BsEraserFill}
          onClick={handleClean}
        />
      </div>
      <FileChooser trigger={fileTrigger} onLoadFile={handleLoadFile}/>
      <TextInput
        className="sip-account-form-text-in"
        Icon={BsPersonFill}
        label="User"
        name="username"
        value={localSipAccount.username}
        onChange={handleChange}
      />
      <TextInput
        className="sip-account-form-text-in"
        Icon={BsKeyFill}
        label="Password"
        name="password"
        value={localSipAccount.password}
        onChange={handleChange}
      />
      <TextInput
        className="sip-account-form-text-in"
        label="Domain"
        name="domain"
        value={localSipAccount.domain}
        onChange={handleChange}
      />
      <TextInput
        className="sip-account-form-text-in"
        label="SIP Proxy"
        name="proxy"
        value={localSipAccount.proxy}
        onChange={handleChange}
      />
      <Button
        className="sip-account-form-save-btn"
        text="Save"
        onClick={handleSave}
      />
    </form>
  );
}

export default SipAccountForm;
