import { FC } from "react";
import { BsPersonFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import PendingTab from "./PendingTab";
import ErrorMessage from "./ErrorMessage";
import PhotoApi from "../services/photos";
import "./Photo.css";

interface Props {
  photo?: string;
  size: number;
  alt?: string;
}

const Photo: FC<Props> = ({ photo, size, alt }) => {
  if (!photo) {
    return (
      <div className="photo" style={{ width: size, height: size }}>
        <BsPersonFill size={size - 10}/>
      </div>
    )
  }

  if (isUrl(photo)) {
    return (
      <div className="photo" style={{ width: size, height: size }}>
        <img className="photo-img" src={photo} width={size} alt={alt} />
      </div>
    )
  }

  const fetching = useQuery({
    queryKey: PhotoApi.QueryKeys.photo(photo),
    queryFn: () => PhotoApi.get(photo),
  })

  return (
    <div className="photo" style={{ width: size, height: size }}>
      {fetching.isPending && <PendingTab text="LOADING" /> }
      {fetching.isError && <ErrorMessage error={fetching.error} />}
      {fetching.data && <img className="photo-img" src={fetching.data} width={size} alt={alt} />}
    </div>
  );
}

function isUrl(photo: string): boolean {
  return photo.includes("http://") || photo.includes("https://");
}

export default Photo;
