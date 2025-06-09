import { styled } from "@linaria/react";
import { FC } from "react";
import { useTheme } from "hooks/useTheme";
import { font } from "styles";

const Box = styled.div<{ size: number, border: string, bg: string }>`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid ${p => p.border};
  background-color: ${p => p.bg};
  cursor: pointer;

  transition: all ease-in-out 0.25s;
`;

interface Props {
  checked: boolean;
  size?: number;
}

const CheckBox: FC<Props> = ({ checked, size }) => {
  const th = useTheme();

  return (
    <Box
      size={size || font.size.xl}
      border={checked ? th.colors.yellow : th.colors.bgDisabled}
      bg={checked ? th.colors.yellow : "#0000"}
    />
  );
};

export default CheckBox;
