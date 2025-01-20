import { FC, useState, ReactElement } from "react";

interface Props {
  children: (isHover: boolean) => ReactElement;
}

const Hover: FC<Props> = ({ children }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const Node = children(isHovered);
  return (
      <Node.type
        {...Node.props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    )
}

export default Hover;
