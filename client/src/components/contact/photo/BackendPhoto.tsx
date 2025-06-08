import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import { AnimatePresence } from "framer-motion";
import ErrorBanner from "components/common/messages/ErrorBanner";
import FadeMotion from "components/common/motion/FadeMotion";
import PendingPane from "components/common/motion/PendingPane";
import PhotoApi from "services/photos";
import { d } from "lib/i18n";

const Image = styled.img`
  object-fit: cover;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;

interface Props {
  photo: string;
  size: number;
  alt?: string;
}

const BackendPhoto: FC<Props> = ({ photo, size, alt }) => {
  const { t } = useTranslation();

  const { data, isPending, error } = useQuery({
    queryKey: PhotoApi.QueryKeys.photo(photo),
    queryFn: () => PhotoApi.get(photo),
  })

  return (
    <AnimatePresence mode="wait">
      {isPending && <PendingPane label={t(d.ui.loading.loading)} size={size / 6} /> }
      {error && <ErrorBanner error={error} size={size / 8} />}
      {data && (
        <FadeMotion key="image">
          <Image src={data} width={size} alt={alt} />
        </FadeMotion>
      )}
    </AnimatePresence>
  );
}

export default BackendPhoto;
