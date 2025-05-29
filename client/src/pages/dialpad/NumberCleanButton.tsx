import { FC } from "react";
import { MdBackspace, MdOutlineBackspace } from "react-icons/md";
import { styled } from "@linaria/react";
import Hover from "../../components/common/Hover";
import { useTheme } from "../../hooks/useTheme";
import { font } from "../../styles";

interface Props {
  clean: () => void;
  enabled: boolean;
}

const StyledNumberCleanButton = styled.button<{ color: string, activeColor: string, disabledColor: string }>`
  color: ${p => p.color};
  background: #0000;
  cursor: pointer;
  border: none;
  padding: 5px;
  font-size: ${font.size.xxl}px;
  transition: all ease-in-out 0.3s;
  display: flex;
  align-items: center;

  &:not(:disabled):active {
    color: ${p => p.activeColor};
  }

  &:disabled {
    color: ${p => p.disabledColor};
  }
`;

const NumberCleanButton: FC<Props> = ({ clean, enabled }) => {
  const th = useTheme();

  return (
    <Hover>
      {isHovered => (
        <StyledNumberCleanButton
          color={th.colors.red}
          activeColor={th.colors.redHover}
          disabledColor={th.colors.textDisabled}
          onClick={() => clean()}
          disabled={!enabled}
        >
          {enabled && isHovered ? <MdBackspace /> : <MdOutlineBackspace />}
        </StyledNumberCleanButton>
      )}
    </Hover>
  );
};

export default NumberCleanButton;
