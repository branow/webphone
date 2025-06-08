import { FC } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { styled } from "@linaria/react";
import Select from "components/common/input/Select";
import { useTheme } from "hooks/useTheme";
import { d } from "lib/i18n";
import { font } from "styles";

interface ContainerProps {
  bgHover: string;
  shadow: string;
  shadowHover: string;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & .option {
    margin: 1px;
    padding: 5px;
    width: fit-content;
    background-color: #0000;
    box-shadow: 0 4px 4px ${p => p.shadow};
    border: none;
    border-radius: 10%;
    cursor: pointer;
    transition: all ease-in-out 0.3s;
  }

  & .option:hover {
    background-color: ${p => p.bgHover};
    box-shadow: 0 4px 4px ${p => p.shadowHover};
  }
`;

const Name = styled.div<{ color: string }>`
  font-size: ${font.size.m}px;
  color: ${p => p.color};
`;

const langs = ["en", "es", "uk"];

type LangCode = typeof langs[number];

const LanguageSetting: FC = () => {
  const { t, i18n } = useTranslation();
  const th = useTheme();

  const currentLang = langs.includes(i18n.language as LangCode)
    ? (i18n.language as LangCode)
    : "en";

  return (
    <Container
      bgHover={th.colors.bgHover}
      shadow={th.colors.bgHover}
      shadowHover={th.colors.bgActive}
    >
      <Name color={th.colors.text}>{t(d.settings.language)}</Name>
      <Select
        options={langs}
        getKey={(lang) => lang}
        render={(lang) => <Flag lang={lang} />}
        onSelect={(lang) => i18n.changeLanguage(lang)}
        init={currentLang}
      />
    </Container>
  );
};

export default LanguageSetting;

const countries = new Map<LangCode, string>([
  ["en", "us"],
  ["es", "es"],
  ["uk", "ua"],
]);

const Flag: FC<{ lang: LangCode }> = ({ lang }) => {
  const country = countries.get(lang);
  if (!country) {
    console.warn(`No country code found for language: ${lang}`);
    return <span>{lang.toUpperCase()}</span>;
  }

  return (
    <ReactCountryFlag
      svg
      countryCode={country}
      alt={lang}
      style={{ width: "2em", height: "1.5em" }}
    />
  );
};
