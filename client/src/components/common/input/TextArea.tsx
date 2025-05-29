import { FC, ChangeEvent, HTMLAttributes } from "react";
import { AnimatePresence } from "framer-motion";
import { styled } from "@linaria/react";
import AutoHeightMotion from "../motion/AutoHeightMotion";
import FadeMotion from "../motion/FadeMotion";
import ErrorMessage from "../messages/ErrorMessage";
import { useTheme } from "../../../hooks/useTheme";
import { font } from "../../../styles";

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label<{ color: string }>`
  font-size: ${font.size.m - 2}px;
  color: ${p => p.color};
  font-weight: bold;
`;

const Area = styled.textarea<{ raws: number, border: string, color: string }>`
  width: 100%;
  height: ${p => p.raws * font.size.m + 30}px;
  padding: 7px 10px;
  box-sizing: border-box;
  border: none;
  border-radius: 5px;
  border-bottom: 2px solid ${p => p.border};
  color: ${p => p.color};
  font-size: ${font.size.m}px;

  &:focus {
    outline: 2px solid ${p => p.border};
  }
`;

interface Props extends HTMLAttributes<HTMLTextAreaElement> {
  onValueChange: (value: string) => void;
  raws?: number;
  value?: string;
  label?: string;
  error?: string;
  name?: string;
  placeholder?: string;
}

const TextArea: FC<Props> = (props) => {
  const th = useTheme();

  const { label, raws, error, onValueChange, ...areaProps  } = props;

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) props.onChange(event);
    onValueChange(event.target.value);
  }

  return (
    <Container>
      {label &&
        <Label color={th.colors.title} htmlFor={props.name}>
          {label}
        </Label>
      }
      <AutoHeightMotion>
        <AnimatePresence mode="wait">
          {error && (
            <FadeMotion key="error">
              <ErrorMessage error={error} />
            </FadeMotion>
          )}
        </AnimatePresence>
      </AutoHeightMotion>
      <Area
        raws={raws ?? 5}
        border={th.colors.surface2}
        color={th.colors.text}
        {...areaProps}
        onChange={handleOnChange}
      />
    </Container>
  );
};

export default TextArea;
