import { FC } from "react";
import { Link } from "react-router";
import { css } from "@linaria/core";
import { useTheme } from "../../hooks/useTheme";
import { font } from "../../styles";

const title = css`
  text-transform: uppercase;
  font-size: ${font.size.xl}px;
  font-weight: bold;
  color: transparent;
  background-clip: text;
`;

const NavBarTitle: FC = () => {
  const th = useTheme();

  return (
    <Link
      className={title}
      to="/dialpad"
      style={{
        backgroundImage: `radial-gradient(ellipse, ${th.colors.navbar.color1}, ${th.colors.navbar.color2})`
      }}
    >
      Webphone
    </Link>
  );
};

export default NavBarTitle;
