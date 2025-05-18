import { useEffect, useState, useContext, useRef } from "react";
import { SipContext } from "../context/SipContext";
import { SipAccount } from "../lib/sip";
import { validator } from "../util/validator";

const emptySipAccount: SipAccount = {
  username: "",
  password: "",
  domain: "",
}

interface SipAccountError {
  connection?: string;
  file?: string;
  username?: string;
  password?: string;
  domain?: string;
}

export function useSipAccountForm() {
  const { account, setAccount, connectionError } = useContext(SipContext);
  const [form, setForm] = useState<SipAccount>(emptySipAccount);
  const [error, setError] = useState<SipAccountError>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError(prev => ({ ...prev, connection: connectionError}))
  }, [connectionError])

  useEffect(() => {
    if (account) setForm(account)
  }, [account])

  useEffect(() => {
    validate();
  }, [form])

  const validateUsername = (value: string) => validator(value)
    .notBlank("Username is mandatory")
    .max(200, "Username is too long")
    .validate();

  const validatePassword = (value: string) => validator(value)
    .notBlank("Password is mandatory")
    .max(1000, "Password is too long")
    .validate();

  const validateDomain = (value: string) => validator(value)
    .notBlank("Domain is mandatory")
    .max(200, "Domain is too long")
    .validate();

  const validate = () => {
    updateError({
      username: validateUsername(form.username),
      password: validatePassword(form.password),
      domain: validateDomain(form.domain),
    });
  }

  const updateForm = (updates: Partial<SipAccount>) => {
    setForm(prev => ({ ...prev, ...updates }));
  }

  const updateError = (updates: Partial<SipAccountError>) => 
    setError(prev => ({ ...prev, ...updates }));

  const save = () => {
    setAccount({ ...form });
  };

  const reset = () => {
    setForm(emptySipAccount);
  };

  const selectFile = () => {
    fileInputRef.current?.click();
  };

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) {
        updateError({ file: "Empty file" })
        return;
      }

      try {
        const data = JSON.parse(e.target.result as string);
        setForm({
          username: data.username,
          password: data.password,
          domain: data.domain,
        });
        updateError({ file: undefined })
      } catch (e) {
        console.warn(e);
        updateError({ file: "Failed to read data from file" })
      }
    }
    reader.onerror = () => updateError({ file: "File read error" });
    reader.readAsText(file);
  }

  return {
    error,
    form,
    updateForm,
    fileInputRef,
    selectFile,
    loadFile,
    save,
    reset,
  };
}

