import { FC } from "react";
import ThemeSetting from "./ThemeSetting";
import LanguageSetting from "./LanguageSetting";
import { styled } from "@linaria/react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GeneralSetting: FC = () => {
  return (
    <Container>
      <ThemeSetting />
      <LanguageSetting />
    </Container>
  );
}

export default GeneralSetting;
