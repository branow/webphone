import { FC } from "react";
import "./Photo.css";

interface Props {
  src: string;
  alt?: string;
}

const Photo: FC<Props> = ({ src, alt }) => {
  return (
    <img className="photo" src={src} alt={alt} />
  );
}

export default Photo;
