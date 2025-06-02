import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { styled } from "@linaria/react";
import { Tab } from "./NavTabs";
import { useTheme } from "../../hooks/useTheme";
import { d } from "../../lib/i18n";
import { font } from "../../styles";

const NavTabButton = styled.div<{ bgHover: string, bgActive: string}>`
  text-transform: uppercase;
  text-align: center;
  flex: 1;
  font-size: ${font.size.l}px;
  border: none;
  border-radius: 10%;
  background-color: #0000;
  cursor: pointer;
  transition: all ease-in-out 0.3s;

  &:hover {
    background-color: ${p => p.bgHover};
  }

  &:active {
    background-color: ${p => p.bgActive};
  }

  & a {
    width: 100%;
    height: 100%;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Label = styled.div<{ color: string }>`
  color: ${p => p.color};
`;

interface Props {
  tab: Tab;
}

function path(tab: Tab): string {
  return {
    [Tab.DIALPAD]: "/dialpad",
    [Tab.HISTORY]: "/history",
    [Tab.CONTACTS]: "/contacts",
    [Tab.ACCOUNTS]: "/accounts",
    [Tab.ADMIN]: "/admin",
  }[tab];
}

const NavTab: FC<Props> = ({ tab }) => {
  const { t } = useTranslation();
  const th = useTheme();

  return (
    <NavTabButton
      bgHover={th.colors.bgHover}
      bgActive={th.colors.bgActive}
    >
      <Link to={path(tab)}>
        <Label color={th.colors.title}>{t(d.ui.tabs[tab])}</Label>
      </Link>
    </NavTabButton>
  );
};

export default NavTab;
