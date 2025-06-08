import { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@linaria/react";
import NumberTypeIcon from "components/contact/NumberTypeIcon";
import { useTheme } from "hooks/useTheme";
import { NumberType } from "services/contacts";
import { d } from "lib/i18n";

const Container = styled.div<{ color: string, fontSize: number }>`
  font-size: ${p => p.fontSize}px;
  color: ${p => p.color};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Label = styled.div``;

interface Props {
  type: NumberType;
  fontSize: number;
}

const NumberTypeLabel: FC<Props> = ({ type, fontSize }) => {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Container color={th.colors.subtitle} fontSize={fontSize}>
      <NumberTypeIcon type={type} />
      <Label>{t(d.contact.numberTypes[type])}</Label>
    </Container>
  );
}

export default NumberTypeLabel
