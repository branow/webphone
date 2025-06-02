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
    interpolation: {
      escapeValue: false,
    },
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
      authenticating: "ui.loading.authenticating",
      connecting: "ui.loading.connecting",
      cleaning: "ui.loading.cleaning",
      calling: "ui.loading.calling",
      creating: "ui.loading.creating",
      loading: "ui.loading.loading",
      deleting: "ui.loading.deleting",
      importing: "ui.loading.importing",
      saving: "ui.loading.saving",
      redirecting: "ui.loading.redirecting",
      updating: "ui.loading.updating",
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
      accounts: "ui.tabs.accounts",
      admin: "ui.tabs.admin",
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
      noContacts:  "contact.messages.noContacts",
    },
  },

  account: {
    title: "account.title",
    mode: {
      user: "account.mode.user",
      self: "account.mode.self",
      default: "account.mode.default",
    },
    fields: {
      info: "account.fields.info",
      active: "account.fields.active",
      inactive: "account.fields.inactive",
      user: "account.fields.user",
      username: "account.fields.username",
      sipCredentials: "account.fields.sipCredentials",
      sipUsername: "account.fields.sipUsername",
      sipPassword: "account.fields.sipPassword",
      sipDomain: "account.fields.sipDomain",
      sipProxy: "account.fields.sipProxy",
    },
    messages: {
      deleteWarning: "account.messages.deleteWarning",
      createAccount: "account.messages.createAccount",
      defaultAccountWarning: "account.messages.defaultAccountWarning",
      noAccountWarning: "account.messages.noAccountWarning",
      noAccount: "account.messages.noAccount",
      noAccounts: "account.messages.noAccounts",
    },
    errors: {
      emptyUser: "account.errors.emptyUser",
      emptyUsername: "account.errors.emptyUsername",
      emptySipUsername: "account.errors.emptySipUsername",
      emptySipPassword: "account.errors.emptySipPassword",
      emptySipDomain: "account.errors.emptySipDomain",
      emptySipProxy: "account.errors.emptySipProxy",
      longUser: "account.errors.longUser",
      longUsername: "account.errors.longUsername",
      longSipUsername: "account.errors.longSipUsername",
      longSipPassword: "account.errors.longSipPassword",
      longSipDomain: "account.errors.longSipDomain",
      longSipProxy: "account.errors.longSipProxy",
    },
    types: {
      admin: "account.types.admin",
      default: "account.types.default",
    },
  },

  sip: {
    messages: {
      success: "sip.messages.success",
    },
    errors: {
      connection: "sip.errors.connection",
      registration: "sip.errors.registration"
    },
  },

  errors: {
    account: {
      title: "errors.account.title",
      message: "errors.account.message",
    },
    auth: {
      title: "errors.auth.title",
      message: "errors.auth.message",
      retryLogin: "errors.auth.retryLogin",
    },
    e404: {
      title: "errors.404.title",
      message: "errors.404.message",
    },
    retry: "errors.retry",
    takeMeHome: "errors.takeMeHome",
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
        account: {
          user: "backend.errors.entityExists.account.user",
          sipUsername: "backend.errors.entityExists.account.sipUsername",
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
    moveToAdmin: "settings.moveToAdmin",
    general: "settings.general",
    theme: "settings.theme",
    language: "settings.language",
    contacts: "settings.contacts",
    featureCodes: "settings.featureCodes",
    comingSoon: "settings.comingSoon",
  },

  history: {
    title: "history.title",
    messages: {
      noHistory:  "history.messages.noHistory",
    },
  },

  admin: {
    title: "admin.title",
    messages: {
      commingSoon: "admin.messages.comingSoon",
    },
  },
};
