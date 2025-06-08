import { FC } from "react";
import { styled } from "@linaria/react";
import NavBarTitle from "components/navbar/NavBarTitle";
import SettingButton from "components/navbar/SettingButton";
import ErrorWarning from "components/navbar/ErrorWarning";
import { useTheme } from "hooks/useTheme";

const NavBarContainer = styled.div<{ bg: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.bg};
  z-index: 100;
`;

const NavBar: FC = () => {
  const th = useTheme();

  return (
    <NavBarContainer bg={th.colors.surface1}>
      <ErrorWarning />
      <NavBarTitle />
      <SettingButton />
    </NavBarContainer>
  );
};

export default NavBar;
