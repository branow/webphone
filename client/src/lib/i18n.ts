import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const CONTEXT_PATH = import.meta.env.WEBPHONE_CONTEXT_PATH;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${CONTEXT_PATH}/locales/{{lng}}/{{ns}}.json`,
    },
    fallbackLng: "en",
    debug: true,
  });

export default i18n;

export const d = {
  ui: {
    loading: {
      connecting: "ui.loading.connecting",
      cleaning: "ui.loading.cleaning",
      calling: "ui.loading.calling",
      creating: "ui.loading.creating",
      loading: "ui.loading.loading",
      deleting: "ui.loading.deleting",
      importing: "ui.loading.importing",
      saving: "ui.loading.saving",
      redirecting: "ui.loading.redirecting",
      updating: "ui.loading.update",
      wait: "ui.loading.wait",
    },
    buttons: {
      save: "ui.buttons.save",
      ok: "ui.buttons.ok",
      import: "ui.buttons.import",
      cancel: "ui.buttons.cancel",
      back: "ui.buttons.back",
    },
    tabs: {
      dialpad: "ui.tabs.dialpad",
      history: "ui.tabs.history",
      contacts: "ui.tabs.contacts",
      account: "ui.tabs.account",
    },
    search: {
      placeholder: "ui.search.placeholder",
    },
    duration: {
      minutes: "ui.duration.minutes",
      seconds: "ui.duration.seconds",
    },
  },

  dialpad: {
    placeholder: "dialpad.placeholder",
  },

  call: {
    status: {
      incoming: "call.status.incoming",
      outgoing: "call.status.outgoing",
      missed: "call.status.missed",
      failed: "call.status.failed",
    },
    messages: {
      success: "call.messages.success",
      failed: "call.messages.failed",
      endedByYou: "call.messages.endedByYou",
      endedByOther: "call.messages.endedByOther",
    },
    errors: {
      missingNumber: "call.errors.missingNumber",
      missingId: "call.errors.missingId",
      invalidNumber: "call.errors.invalidNumber",
      unavailable: "call.errors.unavailable",
      noAnswer: "call.errors.noAnswer",
      rejected: "call.errors.rejected",
      unexpected: "call.errors.unexpected",
    },
  },

  contact: {
    fields: {
      name: "contact.fields.name",
      bio: "contact.fields.bio",
      contact: "contact.fields.contact",
      history: "contact.fields.history",
    },
    numberTypes: {
      work: "contact.numberTypes.work",
      home: "contact.numberTypes.home",
      mobile: "contact.numberTypes.mobile",
    },
    errors: {
      emptyName: "contact.errors.emptyName",
      emptyNumber: "contact.errors.emptyNumber",
      emptyNumbers: "contact.errors.emptyNumbers",
      shortName: "contact.errors.shortName",
      longBio: "contact.errors.longBio",
      longName: "contact.errors.longName",
      longNumber: "contact.errors.longNumber",
      largePhoto: "contact.errors.largePhoto",
    },
    messages: {
      deleteWarning: "contact.messages.deleteWarning",
    },
  },

  account: {
    fields: {
      username: "account.fields.username",
      password: "account.fields.password",
      domain: "account.fields.domain",
    },
    messages: {
      success: "account.messages.success",
    },
    errors: {
      emptyUsername: "account.errors.emptyUsername",
      emptyPassword: "account.errors.emptyPassword",
      emptyDomain: "account.errors.emptyDomain",
      emptyFile: "account.errors.emptyFile",
      longUsername: "account.errors.longUsername",
      longPassword: "account.errors.longPassword",
      longDomain: "account.errors.longDomain",
      readFile: "account.errors.readFile",
      uploadFile: "account.errors.uploadFile",
      connectionFailed: "account.errots.connectionFailed",
      registrationFailed: "account.errots.registrationFailed"
    },
  },

  errors: {
    e404: {
      title: "errors.404.title",
      message: "errors.404.message",
    },
    takeMeHome: "errors.general.takeMeHome",
  },

  backend: {
    errors: {
      unexpected: "backend.errors.unexpected",
      invalid: {
        numberType: "backend.errors.invalid.numberType",
        callStatus: "backend.errors.invalid.callStatus",
      },
      uploadPhoto: "backend.errors.uploadPhoto",
      entityExists: {
        contact: {
          id: "backend.errors.entityExists.contact.id",
          name: "backend.errors.entityExists.contact.name",
          number: "backend.errors.entityExists.contact.number",
        },
      },
      entityNotFound: {
        contact: {
          id: "backend.errors.entityNotFound.contact.id",
        },
      },
      missing: {
        name: "backend.errors.missing.name",
        number: "backend.errors.missing.number",
      },
      empty: {
        numbers: "backend.errors.empty.numbers",
      },
      size: {
        name: "backend.errors.size.name",
        bio: "backend.errors.size.bio",
        numbers: "backend.errors.size.numbers",
      },
      pattern: {
        number: "backend.errors.pattern.number",
      },
    },
  },

  settings: {
    title: "settings.title",
    general: "settings.general",
    theme: "settings.theme",
    language: "settings.language",
    contacts: "settings.contacts",
    featureCodes: "settings.featureCodes",
    comingSoon: "settings.comingSoon",
  },

  history: {
    title: "history.title",
  },
};
