import { FC } from "react";
import { useTheme } from "hooks/useTheme";
import { styled } from "@linaria/react";

const Bar = styled.div<{ border: string }>`
  border-bottom: 2px solid ${p => p.border};
  width: 100%;
`;

const ChapterBar: FC = () => {
  const th = useTheme();

  return <Bar border={th.colors.surface2}></Bar>;
}

export default ChapterBar;
