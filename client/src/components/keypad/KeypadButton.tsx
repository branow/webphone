import { FC } from "react";
import { styled } from "@linaria/react";
import TransparentRoundButton from "../../components/common/button/TransparentRoundButton";
import { useTheme } from "../../hooks/useTheme";
import DTMFAudio from "../../util/dtmf.js";


const Container = styled.div<{ size: number }>`
  padding: ${p => p.size / 2}px;
`;

const Sign = styled.div<{ size: number }>`
  font-size: ${p => p.size}px;
`;

const Label = styled.div<{ size: number, color: string }>`
  font-size: ${p => p.size / 2}px;
  color: ${p => p.color};
`;

interface Props {
  size: number;
  sign: string,
  label: string,
  onPressKey: () => void;
}

const KeypadButton: FC<Props> = ({ sign, label, onPressKey, size }) => {
  const th = useTheme();

  const handlePressKey = () => {
    onPressKey();
    DTMFAudio.play(sign);
  }

  return (
    <TransparentRoundButton
      color={th.colors.text}
      colorHover={th.colors.text}
      onClick={handlePressKey}
    >
      <Container size={size}>
        <Sign size={size}>{sign}</Sign>
        <Label size={size} color={th.colors.title}>{label}</Label>
      </Container>
    </TransparentRoundButton>
  );
};

export default KeypadButton;
