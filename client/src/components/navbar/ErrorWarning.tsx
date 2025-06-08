import { FC, useContext, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { IoIosWarning } from "react-icons/io";
import { styled } from "@linaria/react";
import AutoHeightMotion from "components/common/motion/AutoHeightMotion";
import { ErrorContext, PrioritizedMessage } from "context/ErrorContext";
import { useTheme } from "hooks/useTheme";
import { font, size } from "styles";

const ErrorWarning: FC = () => {
  const [checked, setChecked] = useState<string[]>([]);
  const { errors } = useContext(ErrorContext);

  useEffect(() => {
    setChecked(prev => prev.filter(key => errors.has(key)))
  }, [errors]);

  const isChecked = (): boolean => {
    return Array.from(errors.keys()).every(key => checked.includes(key));
  }

  const check = () => {
    setChecked(Array.from(errors.keys()));
  }

  return (
    <>
      {errors.size > 0 && (
        <ErrorWarningContent
          errors={errors}
          checked={isChecked()}
          check={check}
        />
      )}
    </>
  );
};

export default ErrorWarning;

const IconContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: ${size.navbar.h}px;
  width: ${size.navbar.h}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.div<{ color: string, colorHover: string }>`
  color: ${p => p.color};

  &:hover {
    color: ${p => p.colorHover};
  }
`;

const MessageContainer = styled.div<{ color: string, bg: string }>`
  position: absolute;
  top: ${size.navbar.h}px;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  font-size: ${font.size.s}px;
  color: ${p => p.color};
  background-color: ${p => p.bg};
`;

const Message = styled.div`
  padding: 10px;
`;

interface ErrorWarningContentProps {
  errors: Map<string, PrioritizedMessage>;
  checked: boolean;
  check: () => void;
}

const ErrorWarningContent: FC<ErrorWarningContentProps> = ({ errors, checked, check }) => {

  const animation = useAnimation();

  useEffect(() => {
    if (!checked) {
      animation.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, repeat: Infinity },
      });
    } else {
      animation.stop();
      animation.set({ scale: 1 });
    }
  }, [checked]);

  const [isHovered, setIsHovered] = useState(false);

  const th = useTheme();

  const maxPriority = Math.max(...Array.from(errors.values()).map(m => m.priority));
  let theme = { color: th.colors.red, colorHover: th.colors.redHover }
  if (maxPriority < 20) theme = { color: th.colors.yellow, colorHover: th.colors.yellowHover }
  if (maxPriority < 10) theme = { color: th.colors.surface2, colorHover: th.colors.iconGray }

  return (
    <>
      <IconContainer>
        <Icon
          color={theme.color}
          colorHover={theme.colorHover}
          onClick={check}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div animate={animation}>
            <IoIosWarning
              size={font.size.xxl}
              style={{
                filter: `drop-shadow(0px 0px 3px ${theme.color})`,
              }}
            />
          </motion.div>
        </Icon>
      </IconContainer>
      <MessageContainer color={th.colors.iconLight} bg={theme.colorHover}>
        <AutoHeightMotion>
          {isHovered && (
            <>
              {Array.from(errors)
                .sort((e1, e2) => e2[1].priority - e1[1].priority)
                .map((error) => (
                  <Message key={error[0]}>
                    {error[1].message}
                  </Message>
                ))}
            </>
          )}
        </AutoHeightMotion>
      </MessageContainer>
    </>
  );
};
