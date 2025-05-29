import { FC } from "react";
import { Link } from "react-router";
import { css } from "@linaria/core";
import { font } from "../../styles";

const title = css`
  text-transform: uppercase;
  font-size: ${font.size.xl}px;
  font-weight: bold;
  color: transparent;
  background-clip: text;
  background-image: radial-gradient(ellipse, #553c9a, #ee4b2b);
`;

const NavBarTitle: FC = () => {
  return (
    <Link className={title} to="/dialpad">
      Webphone
    </Link>
  );
};

export default NavBarTitle;
