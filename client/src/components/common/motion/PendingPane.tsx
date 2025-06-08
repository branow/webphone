import { FC } from "react";
import { motion } from "framer-motion";
import { styled } from "@linaria/react";
import FadeMotion from "components/common/motion/FadeMotion";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div<{ size: number, color1: string, color2: string }>`
  text-transform: uppercase;
  width: fit-content;
  font-size: ${p => p.size}px;
  font-weight: bold;
  line-height: 1.5;
  letter-spacing: -5px;
  overflow: hidden;

  color: #0000;
  background:
    radial-gradient(1.13em at 50% 1.6em, ${p => p.color2} 105%, ${p => p.color1} 101%) calc(50% - 1.6em) 0/3.2em 100% text,
    radial-gradient(1.13em at 50% -0.8em, #0000 99%, ${p => p.color2} 101%) 50% .8em/3.2em 100% repeat-x  text;
  animation: l9 2s linear infinite;

  @keyframes l9 {
    to {background-position: calc(50% + 1.6em) 0,calc(50% + 3.2em) .8em}
  }
`

const Message = styled.div<{ size: number, color: string }>`
  font-size: ${p => p.size}px;
  font-weight: bold;
  color: ${p => p.color};
  text-align: center;
`;

interface Props {
  label: string;
  message?: string;
  size?: number;
}

const PendingPane: FC<Props> = ({ label, message, size }) => {
  const th = useTheme();
  const lSize = size || font.size.x3l;
  const mSize = Math.ceil(lSize / 1.9);

  return (
    <FadeMotion>
      <Container>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <Label
            size={lSize}
            color1={th.colors.green}
            color2={th.colors.greenHover}
          >
            {label}
          </Label>
          {message && <Message size={mSize} color={th.colors.subtitle}>{message}</Message>}
        </motion.div>
      </Container>
    </FadeMotion>
  );
}


export default PendingPane;
