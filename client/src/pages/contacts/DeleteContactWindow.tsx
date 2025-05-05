import { FC } from "react";
import Window from "../../components/Window";
import "./DeleteContactWindow.css";

interface Props {
  contactName: string;
  close: () => void;
  deleteContact: () => void;
}

const DeleteContactWindow: FC<Props> = ({ contactName, deleteContact, close }) => {
  return (
    <Window close={close}>
      <div className="delete-contact-wdw">
        <div className="delete=contact-wdw-message">
          Are you sure you want to delete the contact <strong>{contactName}</strong> ?
        </div>
        <div className="delete-contact-wdw-ctrls">
          <button
            className="transparent-rect-btn"
            onClick={deleteContact}
          >
            OK
          </button>
          <button
            className="transparent-rect-btn"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </div>
    </Window>
  );
}

export default DeleteContactWindow;
