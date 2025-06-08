import { FC } from "react";
import { styled } from "@linaria/react";
import ThemeSetting from "pages/setting/ThemeSetting";
import LanguageSetting from "pages/setting/LanguageSetting";

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
