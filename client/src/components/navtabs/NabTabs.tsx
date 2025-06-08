import { FC } from "react";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import ControlPane from "components/common/pane/ControlPane";
import { useTheme } from "hooks/useTheme";
import { font, size } from "styles";

const Container = styled.div<{ bg: string }>`
  position: absolute;
  bottom: 5px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  background-color: ${p => p.bg}
`;

export interface NavTab {
  label: string;
  path: string;
  disabled?: boolean;
}

interface Props {
  tabs: NavTab[];
}

const NavTabs: FC<Props> = ({ tabs }) => {
  const th = useTheme();
  const navigate = useNavigate();

  return (
    <Container bg={th.colors.surface1}>
      <ControlPane
        height={size.tabs.h}
        size={font.size.l}
        controls={tabs.map(tab => ({
          key: tab.label,
          children: tab.label,
          onClick: () => navigate(tab.path),
          disabled: tab.disabled,
        }))}
      />
    </Container>
  );
}

export default NavTabs;
