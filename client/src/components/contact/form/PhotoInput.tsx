import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styled } from "@linaria/react";
import { BsCloudUploadFill, BsFillTrash3Fill } from "react-icons/bs";
import Hover from "components/common/Hover";
import Photo from "components/contact/photo/Photo";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const Container = styled.div`
  width: 115px;
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Frame = styled.div`
  position: relative;
  width: 100px;
  aspect-ratio: 1/1;
  overflow: hidden;
  border-radius: 50%;
`;

interface ButtonProps {
  color: string;
  bg: string;
  bgHover: string;
}

const Button = styled.button<ButtonProps>`
  width: 100%;
  height: 30px;
  border: none;
  color: ${p => p.color};
  background-color: ${p => p.bg};
  transition: all ease-in-out 0.3s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${p => p.bgHover};
  }

  &:active {
    background-color: ${p => p.bg};
  }
`;

interface Props {
  choose: () => void;
  remove: () => void;
  src?: string;
}

const PhotoInput: FC<Props> = ({ src, choose, remove }) => {
  const th = useTheme();

  return (
    <Container>
      <Hover>
        {(hover) => (
          <motion.div
            style={{ position: "relative" }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Frame>
              <Photo
                src={src}
                size={100}
              />
              <AnimatePresence>
                {hover && src && (
                  <motion.div
                    key="delete"
                    style={{ position: "absolute", top: 0, width: "100%" }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 60 }}
                  >
                    <Button
                      onClick={remove}
                      color={th.colors.iconLight}
                      bg={th.colors.red}
                      bgHover={th.colors.redHover}
                    >
                      <BsFillTrash3Fill size={font.size.l} />
                    </Button>
                  </motion.div>
                )}
                {hover && (
                  <motion.div
                    key="upload"
                    style={{ position: "absolute", bottom: 0, width: "100%" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 60 }}
                  >
                    <Button
                      onClick={choose}
                      color={th.colors.iconLight}
                      bg={th.colors.blue}
                      bgHover={th.colors.blueHover}
                    >
                      <BsCloudUploadFill size={font.size.l} />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Frame>
          </motion.div>
        )}
      </Hover>
    </Container>
  );
};

export default PhotoInput;
