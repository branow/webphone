import { FC, useContext } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { css } from "@linaria/core";
import { useTheme } from "hooks/useTheme";
import { SipContext } from "context/SipContext";
import { d } from "lib/i18n";
import { font, size } from "styles";
import { Paths } from "routes";

const cssContainer = css`
  position: absolute;
  top: ${size.navbar.h - 15}px;
  z-index: 200;
  width: 100%;
  text-align: center;
  font-size: ${font.size.s}px;
  cursor: pointer;
`;

const CallBar: FC = () => {
  const th = useTheme();
  const sipContext = useContext(SipContext);
  const calls = sipContext.calls.filter(call => !call.state.isEnded());
  const { t } = useTranslation();
  const navigate = useNavigate();

  const move = () => navigate(Paths.CallsActive());

  return (
    <>
      {calls.length > 0 && (
        <motion.div
          className={cssContainer}
          animate={{
            backgroundColor: [ th.colors.green, th.colors.greenHover, th.colors.green ]
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            color: th.colors.iconLight,
          }}
          onClick={move}
        >
          {t(d.calls.messages.inCall) + " "}
          {calls.map(call => call.number).join(", ")}
        </motion.div>
      )}
    </>
  );
};

export default CallBar;
