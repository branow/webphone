import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import Window from "../../components/Window";
import { d } from "../../lib/i18n";
import "./DeleteContactWindow.css";

interface Props {
  contactName: string;
  close: () => void;
  deleteContact: () => void;
}

const DeleteContactWindow: FC<Props> = ({ contactName, deleteContact, close }) => {
  const { t } = useTranslation();

  return (
    <Window close={close}>
      <div className="delete-contact-wdw">
        <div className="delete=contact-wdw-message">
          <Trans
            i18nKey={d.contact.messages.deleteWarning}
            values={{ name: contactName }}
            components={{ bold: <strong /> }}
          />
        </div>
        <div className="delete-contact-wdw-ctrls">
          <button
            className="transparent-rect-btn"
            onClick={deleteContact}
          >
            {t(d.ui.buttons.ok)}
          </button>
          <button
            className="transparent-rect-btn"
            onClick={close}
          >
            {t(d.ui.buttons.cancel)}
          </button>
        </div>
      </div>
    </Window>
  );
}

export default DeleteContactWindow;
