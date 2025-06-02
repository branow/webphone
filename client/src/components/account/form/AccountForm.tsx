import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import { BsKeyFill, BsPersonFill } from "react-icons/bs";
import TextInput from "../../common/input/TextInput";
import Chapter from "../../common/pane/Chapter";
import ControlPane from "../../common/pane/ControlPane";
import ErrorBanner from "../../common/messages/ErrorBanner";
import OptionSet from "../../common/input/OptionSet";
import Toggler from "../../common/input/Toggler";
import { mapAccount, Mode, useEditAccount } from "../../../hooks/useEditAccount";
import { useTheme } from "../../../hooks/useTheme";
import { Account } from "../../../services/accounts";
import { d } from "../../../lib/i18n";
import { font, size } from "../../../styles";

export enum Operation {
  Create = "create",
  Update = "updatel",
}

const Container = styled.div`
  height: 100%;
  max-height: 100%;
`;

const Info = styled.div`
  height: ${size.phone.h - size.navbar.h - size.tabs.h}px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InnerChapter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActivationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Activation = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-size: ${font.size.m}px;
  font-weight: bold;
`;

const Status = styled.div<{ color: string }>`
  text-transform: uppercase;
  text-align: center;
  color: ${p => p.color};
  font-size: ${font.size.l}px;
  font-weight: bold;
`;

interface Props {
  account: Account;
  save: (contact: Account) => void;
  operation: Operation;
  savingError?: Error;
}

const AccountForm: FC<Props> = ({ account, save, operation, savingError }) => {
  const { form, updateForm, error, modes, mode, setMode } = useEditAccount({
    initAccount: account,
  });

  const th = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Info>
        <ErrorBanner error={savingError} />

        {operation === Operation.Update && (
          <Status color={th.colors.yellow}>
            {t(d.account.mode[mode])}
          </Status>
        )}
        <Chapter title={t(d.account.fields.info)}>
          <InnerChapter>
            {operation === Operation.Create && (
              <OptionSet
                options={modes}
                value={mode}
                render={mode => t(d.account.mode[mode])}
                onChange={mode => setMode(mode)}
                getKey={mode => mode}
              />
            )}
            <ActivationContainer>
              <Activation color={th.colors.title}>
                {form.active ? t(d.account.fields.active) : t(d.account.fields.inactive)}
              </Activation>
              <Toggler
                color={th.colors.yellow}
                checked={form.active}
                onChange={active => updateForm({ active })}
              />
            </ActivationContainer>
            {operation === Operation.Create && (
              <TextInput
                label={t(d.account.fields.user)}
                name="user"
                value={form.user}
                onValueChange={user => updateForm({ user })}
                error={error?.user}
                disabled={mode !== Mode.User}
              />
            )}
            <TextInput
              label={t(d.account.fields.username)}
              name="username"
              value={form.username}
              onValueChange={username => updateForm({ username })}
              error={error?.username}
              disabled={mode !== Mode.User}
            />
          </InnerChapter>
        </Chapter>

        <Chapter title={t(d.account.fields.sipCredentials)}>
          <InnerChapter>
            <TextInput
              icon={(size) => <BsPersonFill size={size} />}
              label={t(d.account.fields.sipUsername)}
              name="sipUsername"
              value={form.sipUsername}
              onValueChange={sipUsername => updateForm({ sipUsername })}
              error={error?.sipUsername}
            />
            <TextInput
              icon={(size) => <BsKeyFill size={size} />}
              label={t(d.account.fields.sipPassword)}
              name="sipPassword"
              value={form.sipPassword}
              onValueChange={sipPassword => updateForm({ sipPassword })}
              error={error?.sipPassword}
            />
            <TextInput
              label={t(d.account.fields.sipDomain)}
              name="sipDomain"
              value={form.sipDomain}
              onValueChange={sipDomain => updateForm({ sipDomain })}
              error={error?.sipDomain}
            />
            <TextInput
              label={t(d.account.fields.sipProxy)}
              name="sipProxy"
              value={form.sipProxy}
              onValueChange={sipProxy => updateForm({ sipProxy })}
              error={error?.sipProxy}
            />
          </InnerChapter>
        </Chapter>
      </Info>

      <ControlPane
        height={size.tabs.h}
        size={font.size.m}
        controls={[
          {
            key: "save",
            children: t(d.ui.buttons.save),
            disabled: !!error,
            onClick: () => save(mapAccount(form)),
          },
          {
            key: "cancel",
            children: t(d.ui.buttons.cancel),
            onClick: () => navigate(-1),
          },
        ]}
      />
    </Container>
  );
};

export default AccountForm;
