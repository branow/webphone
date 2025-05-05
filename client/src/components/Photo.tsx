import { FC, ReactNode } from "react";
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
      <PhotoContainer size={size}>
        <BsPersonFill size={size - 10}/>
      </PhotoContainer>
    )
  }

  if (isUrl(photo)) {
    return (
      <PhotoContainer size={size}>
        <img className="photo-img" src={photo} width={size} alt={alt} />
      </PhotoContainer>
    )
  }

  return (
    <PhotoContainer size={size}>
      <BackendPhoto photo={photo} size={size} alt={alt} />
    </PhotoContainer>
  );
}

const PhotoContainer: FC<{ size: number, children: ReactNode }> = ({ size, children }) => {
  return (
    <div className="photo" style={{ width: size, height: size, minWidth: size, minHeight: size }}>
      {children}
    </div>
  );
}

const BackendPhoto: FC<{ photo: string, size: number, alt?: string }> = ({ photo, size, alt }) => {
  const fetching = useQuery({
    queryKey: PhotoApi.QueryKeys.photo(photo),
    queryFn: () => PhotoApi.get(photo),
  })

  return (
    <>
      {fetching.isPending && <PendingTab text="LOADING" /> }
      {fetching.isError && <ErrorMessage error={fetching.error} />}
      {fetching.data && <img className="photo-img" src={fetching.data} width={size} alt={alt} />}
    </>
  );
}

function isUrl(photo: string): boolean {
  return photo.includes("http://") || photo.includes("https://");
}

export default Photo;
