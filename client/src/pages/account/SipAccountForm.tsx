import { FC } from "react";
import { useTranslation } from "react-i18next";
import { BsPersonFill, BsKeyFill, BsEraserFill, BsCloudUploadFill } from "react-icons/bs";
import TextInput from "../../components/common/input/TextInput";
import FileInput from "../../components/common/input/FileInput";
import ErrorMessage from "../../components/common/messages/ErrorMessage";
import TransparentRoundButton from "../../components/common/button/TransparentRoundButton";
import ScaleButton from "../../components/common/button/ScaleButton";
import { useSipAccountForm } from "../../hooks/useSipAccountForm";
import { d } from "../../lib/i18n";
import { styled } from "@linaria/react";
import { font } from "../../styles";
import { useTheme } from "../../hooks/useTheme";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
`;

const Top = styled.div`
  display: flex;
  gap: 7px;
  justify-content: right;
  width: 100%;

  & button {
    padding: 5px;
  }
`;

const SaveLabel = styled.div`
  text-transform: uppercase;
  font-size: ${font.size.m};
  font-weight: bold;
`;

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

  const th = useTheme();

  return (
    <Container>
      <ErrorMessage error={error.connection} />
      <Top>
        <TransparentRoundButton
          color={th.colors.blue}
          colorHover={th.colors.blueHover}
          onClick={selectFile}
        >
          <BsCloudUploadFill size={font.size.xl} />
        </TransparentRoundButton>
        <TransparentRoundButton 
          color={th.colors.red}
          colorHover={th.colors.redHover}
          onClick={reset}
        >
          <BsEraserFill size={font.size.xl}/>
        </TransparentRoundButton>
      </Top>
      <FileInput inputRef={fileInputRef} onFiles={files => loadFile(files[0])}/>
      <TextInput
        icon={(size) => <BsPersonFill size={size} />}
        label={t(d.account.fields.username)}
        name="username"
        value={form.username}
        onValueChange={setUsername}
        error={error.username}
      />
      <TextInput
        icon={(size) => <BsKeyFill size={size} />}
        label={t(d.account.fields.password)}
        name="password"
        value={form.password}
        onValueChange={setPassword}
        error={error.password}
      />
      <TextInput
        label={t(d.account.fields.domain)}
        name="domain"
        value={form.domain}
        onValueChange={setDomain}
        error={error.domain}
      />
      <ScaleButton
        bg={th.colors.green}
        bgHover={th.colors.greenHover}
        size={65}
        onClick={save}
        disabled={!isValidForm()}
      >
        <SaveLabel>
          {t(d.ui.buttons.save)}
        </SaveLabel>
      </ScaleButton>
    </Container>
  );
}

export default SipAccountForm;
