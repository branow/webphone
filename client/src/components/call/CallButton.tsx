import { FC, HTMLAttributes } from "react";
import { ImPhone } from "react-icons/im";
import { cx } from "@linaria/core";
import ScaleButton from "components/common/button/ScaleButton";
import { useTheme } from "hooks/useTheme";
import { styles } from "styles";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  size: number;
  active?: boolean;
  scale?: number;
  disabled?: boolean;
}

const CallButton: FC<Props> = (props) => {
  const th = useTheme();

  const { active, ...buttonProps } = props;

  return (
    <div className={cx(active && styles.pulsatingShaking)}>
      <ScaleButton
        color={th.colors.iconLight}
        bg={th.colors.green}
        bgHover={th.colors.greenHover}
        {...buttonProps}
      >
        <ImPhone size={props.size / 2} style={{ position: "absolute" }} />
      </ScaleButton>
    </div>
  );
};

export default CallButton;
