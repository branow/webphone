import { FC, useRef, ReactNode, MouseEvent } from "react";
import { IoClose } from "react-icons/io5";
import "./Window.css";

interface Props {
  children: ReactNode;
  close?: () => void;
}

const Window: FC<Props> = ({ children, close }) => {
  const backgroundRef = useRef(null);

  const handleClickOnBackground = (event: MouseEvent) => {
    if (close && event.target === backgroundRef.current) {
      close();
    }
  }

  return (
    <div
      className="window-background"
      onClick={handleClickOnBackground}
      ref={backgroundRef}
    >
      <div className="window">
        {close && (
          <button className="transparent-btn window-close-btn" onClick={close}>
            <IoClose />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default Window;
