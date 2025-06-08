import { FC } from "react";
import { Trans } from "react-i18next";
import DeleteWindow from "components/common/pane/RemoveWindow";
import { d } from "lib/i18n";

interface Props {
  accountName: string;
  close: () => void;
  remove: () => void;
}

const DeleteAccountWindow: FC<Props> = ({ accountName, remove, close }) => {
  return (
    <DeleteWindow remove={remove} cancel={close} close={close}>
      <Trans
        i18nKey={d.account.messages.deleteWarning}
        values={{ name: accountName }}
        components={{ bold: <strong /> }}
      />
    </DeleteWindow>
  );
}

export default DeleteAccountWindow;
