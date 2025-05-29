import { FC } from "react";
import { useNavigate } from "react-router";
import { FaGear } from "react-icons/fa6";
import { css } from "@linaria/core";
import TransparentRoundButton from "../common/button/TransparentRoundButton";
import { useTheme } from "../../hooks/useTheme";
import { font } from "../../styles";

const button = css`
  position: absolute;
  right: 5px;
  padding: 7px;
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
    <TransparentRoundButton
      className={button}
      style={{ color: th.colors.iconDark }}
      onClick={handleOnClick}
    >
      <FaGear />
    </TransparentRoundButton>
  );
};

export default SettingButton;
