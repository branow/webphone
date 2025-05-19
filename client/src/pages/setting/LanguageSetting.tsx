import { FC } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import Select from "../../components/common/select/Select";
import { d } from "../../lib/i18n";

const langs = ["en", "es", "uk"];
type LangCode = typeof langs[number];

const countries = new Map<LangCode, string>([
  ["en", "us"],
  ["es", "es"],
  ["uk", "ua"],
]);

const LanguageSetting: FC = () => {
  const { t, i18n } = useTranslation();

  const renderFlag = (lang: string) => {
    const country = countries.get(lang as LangCode);
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

  const currentLang = langs.includes(i18n.language as LangCode)
    ? (i18n.language as LangCode)
    : "en";

  return (
    <div className="setting-lang">
      <div>{t(d.settings.language)}</div>
      <Select
        options={langs}
        getKey={(lang) => lang}
        render={renderFlag}
        onSelect={(lang) => i18n.changeLanguage(lang)}
        init={currentLang}
      />
    </div>
  );
};

export default LanguageSetting;
