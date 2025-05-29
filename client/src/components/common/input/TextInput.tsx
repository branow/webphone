import { FC, ReactNode, ChangeEvent, HTMLAttributes } from "react";
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

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const IconContainer = styled.div<{ color: string }>`
  font-size: ${font.size.x3l}px;
  color: ${p => p.color};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input<{ border: string, color: string }>`
  width: 100%;
  padding: 7px 10px;
  box-sizing: border-box;
  border: none;
  border-radius: 5px;
  border-bottom: 2px solid ${p => p.border};
  color: ${p => p.color};
  background-color: #0000;
  font-size: ${font.size.m}px;

  &:focus {
    outline: 2px solid ${p => p.border};
  }
`;

interface Props extends HTMLAttributes<HTMLInputElement> {
  onValueChange: (value: string) => void;
  value?: string;
  label?: string;
  error?: string;
  icon?: (size: number) => ReactNode;
  name?: string;
  placeholder?: string;
}

const TextInput: FC<Props> = (props) => {
  const th = useTheme();

  const { label, error, onValueChange, icon, ...inputProps  } = props;

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      <InputContainer>
        {icon &&
          <IconContainer color={th.colors.subtitle}>
            {icon(font.size.x3l)}
          </IconContainer>
        }
        <Input
          border={th.colors.surface2}
          color={th.colors.text}
          {...inputProps}
          onChange={handleOnChange}
        />
      </InputContainer>
    </Container>
  );
};

export default TextInput;
