import { FC, HTMLAttributes } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { useTheme } from "../../hooks/useTheme";
import ScaleButton from "../common/button/ScaleButton";
import { styled } from "@linaria/react";
import { cx } from "@linaria/core";
import { styles } from "../../styles";

const Container = styled.div``;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  size: number;
  scale?: number;
  active?: boolean;
}

const HangUpButton: FC<Props> = (props) => {
  const th = useTheme();

  const { active, ...buttonProps } = props;

  return (
    <Container className={cx(active && styles.pulsatingShaking)}>
      <ScaleButton
        color={th.colors.iconLight}
        bg={th.colors.red}
        bgHover={th.colors.redHover}
        {...buttonProps}
      >
        <ImPhoneHangUp size={props.size / 2} style={{ position: "absolute" }} />
      </ScaleButton>
    </Container>
  );
};

export default HangUpButton;
