import { FC } from "react";
import { styled } from "@linaria/react";
import NavTab from "./NavTab";
import { useTheme } from "../../hooks/useTheme";
import { size } from "../../styles";

export enum Tab {
  DIALPAD = "dialpad",
  HISTORY = "history",
  CONTACTS = "contacts",
  ACCOUNTS = "accounts",
  ADMIN = "admin",
}

const NavTabsContainer = styled.div<{ bg: string }>`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: ${size.tabs.h}px;
  padding: 5px 5px;
  box-sizing: border-box;
  display: flex;
  background-color: ${p => p.bg}
`;

interface Props {
  tabs: Tab[];
}

const NavTabs: FC<Props> = ({ tabs }) => {
  const th = useTheme();

  return (
    <NavTabsContainer bg={th.colors.surface1}>
      {tabs.map(tab => <NavTab key={tab} tab={tab} />)}
    </NavTabsContainer>
  );
}

export default NavTabs;
