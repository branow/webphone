import { FC } from "react";
import { useNavigate } from "react-router";
import { FaGear } from "react-icons/fa6";
import { css } from "@linaria/core";
import TransparentRoundButton from "../common/button/TransparentRoundButton";
import { useTheme } from "../../hooks/useTheme";
import { font, size } from "../../styles";
import { styled } from "@linaria/react";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: ${size.navbar.h}px;
  width: ${size.navbar.h}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const button = css`
  font-size: ${font.size.xl}px;

  &:active {
    transform: rotate(90deg);
  }
`;

const SettingButton: FC = () => {
  const th = useTheme();
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (window.location.pathname.endsWith("/settings")) {
      navigate(-1);
    } else {
      navigate("/settings");
    }
  };

  return (
    <Container>
      <TransparentRoundButton
        className={button}
        style={{ color: th.colors.iconDark }}
        onClick={handleOnClick}
      >
        <FaGear />
      </TransparentRoundButton>
    </Container>
  );
};

export default SettingButton;
