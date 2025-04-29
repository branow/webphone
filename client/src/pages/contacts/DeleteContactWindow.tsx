import { FC } from "react";
import Window from "../../components/Window";
import Button from "../../components/Button";
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
          <Button
            className="transparent-rect-btn"
            text="OK"
            onClick={deleteContact}
          />
          <Button
            className="transparent-rect-btn"
            text="Cancel"
            onClick={close}
          />
        </div>
      </div>
    </Window>
  );
}

export default DeleteContactWindow;
