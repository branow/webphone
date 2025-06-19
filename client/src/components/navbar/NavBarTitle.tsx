import { FC } from "react";
import { Link } from "react-router";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const Title = styled.div<{ color1: string, color2: string }>`
  text-transform: uppercase;
  font-size: ${font.size.xl}px;
  font-weight: bold;
  color: transparent;
  background-clip: text;
  background-image: radial-gradient(ellipse, ${p => p.color1}, ${p => p.color2});
  transition: all ease-in-out 0.3s;
  
  &:not(:active):hover {
    filter: drop-shadow(0px 0px 5px ${p => p.color2});
  }
`;

const NavBarTitle: FC = () => {
  const th = useTheme();

  return (
    <Link to="/dialpad" style={{ textDecoration: "none" }}>
      <Title color1={th.colors.navbar.color1} color2={th.colors.navbar.color2}>
        Webphone
      </Title>
    </Link>
  );
};

export default NavBarTitle;
