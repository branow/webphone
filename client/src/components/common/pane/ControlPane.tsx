import { styled } from "@linaria/react";
import { FC, HTMLAttributes, ReactNode } from "react";
import TransparentRectButton from "../button/TransparentRectButton";

const Container = styled.div<{ height: number, size: number }>`
  width: 100%;
  height: ${p => p.height}px;
  padding: 5px 5px;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  gap: 5px;

  & > * {
    flex: 1;
    text-transform: uppercase;
    font-size: ${p => p.size}px;
    font-weight: bold;
    border-radius: 10%;
    display: flex;
    justify-content: center;
    align-content: center;
  }
`;

interface Control extends HTMLAttributes<HTMLButtonElement> {
  key: string;
  children: ReactNode;
  disabled?: boolean;
}

interface Props {
  height: number;
  size: number;
  controls: Control[];
}

const ControlPane: FC<Props> = ({ height, size, controls }) => {
  return (
    <Container height={height} size={size}>
      {controls.map(c => (
        <TransparentRectButton {...c} key={c.key}>
          {c.children}
        </TransparentRectButton>
      ))}
    </Container>
  );
}

export default ControlPane;
