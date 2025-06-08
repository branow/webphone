import { FC, HTMLAttributes, ReactNode } from "react";
import { css, cx } from "@linaria/core";
import TransparentRectButton from "components/common/button/TransparentRectButton";

const round = css`
  border-radius: 50%;
  aspect-ratio: 1/1;
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: string;
  colorHover?: string;
  colorDisabled?: string;
  colorActive?: string;
  disabled?: boolean;
}

const TransparentRoundButton: FC<Props> = (props) => {
  return (
    <TransparentRectButton
      {...props}
      className={cx(round, props.className)}
    >
      {props.children}
    </TransparentRectButton>
  );
}

export default TransparentRoundButton;
