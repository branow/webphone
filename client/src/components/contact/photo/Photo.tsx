import { FC } from "react";
import { BsPersonFill } from "react-icons/bs";
import { styled } from "@linaria/react";
import BackendPhoto from "components/contact/photo/BackendPhoto";
import { useTheme } from "hooks/useTheme";

const Container = styled.div<{ size: number, bg: string, color: string }>`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  min-width: ${p => p.size}px;
  min-height: ${p => p.size}px;
  overflow: hidden;
  border-radius: 50%;
  color: ${p => p.color};
  background-color: ${p => p.bg};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Image = styled.img`
  object-fit: cover;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;

interface Props {
  size: number;
  src?: string;
  alt?: string;
}

const Photo: FC<Props> = ({ src, size, alt }) => {
  const th = useTheme();

  let photo;
  if (!src) {
    photo = <BsPersonFill size={size - 10}/>;
  } else if (isUrl(src)) {
    photo = <Image src={src} alt={alt} width={size} />;
  } else {
    photo = <BackendPhoto photo={src} size={size} alt={alt} />;
  }

  return (
    <Container
      size={size}
      color={th.colors.iconGray}
      bg={th.colors.surface2}
    >
      {photo}
    </Container>
  );
}

function isUrl(photo: string): boolean {
  return photo.includes("http://") || photo.includes("https://");
}

export default Photo;
