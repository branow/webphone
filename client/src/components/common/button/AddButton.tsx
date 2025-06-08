import { FC, HTMLAttributes } from "react";
import { FaPlus } from "react-icons/fa";
import { styled } from "@linaria/react";
import { useTheme } from "hooks/useTheme";

interface ButtonProps {
  size: number;
  bg: string;
  bgHover: string;
  bgDisabled: string;
  color: string;
  shadow: string;
}

const Button = styled.button<ButtonProps>`
  font-size: ${p => p.size}px;
  padding: ${p => p.size / 4}px;
  transition: all ease-in-out 0.5s;
  border: none;
  border-radius: 25%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  color: ${p => p.color};
  background-color: ${p => p.bg};
  box-shadow: 0 0 6px 8px ${p => p.shadow};
  transition: all ease-in-out 0.4s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:not(:disabled):hover {
    background-color: ${p => p.bgHover};
  }

  &:disabled {
    background-color: ${p => p.bgDisabled};
  }
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  size: number;
  disabled?: boolean;
}

const AddButton: FC<Props> = (props) => {
  const th = useTheme();
  const { size, ...buttonProps } = props;

  return (
    <Button
      size={props.size}
      bg={th.colors.green}
      bgHover={th.colors.greenHover}
      bgDisabled={th.colors.bgDisabled}
      color={th.colors.iconLight}
      shadow={th.colors.bgDisabled}
      {...buttonProps}
    >
      <FaPlus />
    </Button>
  );
};

export default AddButton;

