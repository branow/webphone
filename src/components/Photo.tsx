import { FC } from "react";
import { BsPersonFill } from "react-icons/bs";
import "./Photo.css";

interface Props {
  src: string;
  size: string;
  alt?: string;
}

const Photo: FC<Props> = ({ src, size, alt }) => {
  return (
    <div className="photo">
      { src ? 
        (<img className="photo-img" src={src} width={size} alt={alt} />) :
        (<BsPersonFill size={size}/>)
      }
    </div>
  );
}

export default Photo;
