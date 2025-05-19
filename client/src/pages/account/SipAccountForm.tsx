import { FC } from "react";
import { useTranslation } from "react-i18next";
import { BsPersonFill, BsKeyFill, BsEraserFill, BsCloudUploadFill } from "react-icons/bs";
import TextInput from "../../components/TextInput";
import FileChooser from "../../components/FileChooser";
import ErrorMessage from "../../components/ErrorMessage";
import { useSipAccountForm } from "../../hooks/useSipAccountForm";
import { d } from "../../lib/i18n";
import "./SipAccountForm.css";

const SipAccountForm: FC = () => {
  const { t } = useTranslation();
  const {
    error,
    form,
    updateForm,
    save,
    reset,
    fileInputRef,
    selectFile,
    loadFile
  } = useSipAccountForm();

  const setUsername = (username: string) => updateForm({ username });
  const setPassword = (password: string) => updateForm({ password });
  const setDomain = (domain: string) => updateForm({ domain });

  const isValidForm = (): boolean => {
    return !error.username && !error.password && !error.domain;
  }

  return (
    <div className="sip-account-form">
      <ErrorMessage className="sip-account-form-error" error={error.connection} />
      <div className="sip-account-form-control-con">
        <button
          className="upload sip-account-form-control transparent-btn"
          onClick={selectFile}
        >
          <BsCloudUploadFill />
        </button>
        <button
          className="erase sip-account-form-control transparent-btn"
          onClick={reset}
        >
          <BsEraserFill />
        </button>
      </div>
      <FileChooser inputRef={fileInputRef} onLoadFile={loadFile}/>
      <TextInput
        className="sip-account-form-text-in"
        Icon={BsPersonFill}
        label={t(d.account.fields.username)}
        name="username"
        value={form.username}
        onValueChange={setUsername}
        error={error.username}
      />
      <TextInput
        className="sip-account-form-text-in"
        Icon={BsKeyFill}
        label={t(d.account.fields.password)}
        name="password"
        value={form.password}
        onValueChange={setPassword}
        error={error.password}
      />
      <TextInput
        className="sip-account-form-text-in"
        label={t(d.account.fields.domain)}
        name="domain"
        value={form.domain}
        onValueChange={setDomain}
        error={error.domain}
      />
      <div className="sip-account-form-save-btn-ctn">
        <button
          className="sip-account-form-save-btn"
          onClick={save}
          disabled={!isValidForm()}
        >
          {t(d.ui.buttons.save)}
        </button>
      </div>
    </div>
  );
}

export default SipAccountForm;
