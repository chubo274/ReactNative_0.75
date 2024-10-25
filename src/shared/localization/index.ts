import i18n from 'i18next';
import { getI18n, initReactI18next } from 'react-i18next';
import { iLocalization } from './iLocalization';
import en from './resources/en';
import vi from './resources/vi';
import { LANGUAGES } from 'shared/helpers/enum';
import ZustandPersist from 'src/zustand/persist';

export const fallBackLanguage = LANGUAGES.ENGLISH;

const renLanguage = (language?: LANGUAGES) => { // check language is valid ỏr not. if not, app will set fallback is EN
  switch (language) {
    case LANGUAGES.VIETNAM:
      return LANGUAGES.VIETNAM;
      // case LANGUAGES.JAPAN:
      //     return LANGUAGES.JAPAN;
      // case LANGUAGES.KOREA:
      //     return LANGUAGES.KOREA;
    default:
      return fallBackLanguage;
  }
}

export const configureLocalization = (language?: LANGUAGES) => {
  ZustandPersist.getState().save('Localization', renLanguage(language))
  return i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      lng: renLanguage(language),
      fallbackLng: fallBackLanguage,

      resources: {
        en: {
          translation: en
        },
        vi: {
          translation: vi
        },
      },

      debug: false,
      cache: {
        enabled: true
      },
      interpolation: {
        escapeValue: false // not needed for react as it does escape per default to prevent xss!
      }
    });
};

export const getString = (key: keyof iLocalization, params?: any): string => {
  if (getI18n()) {
    return getI18n().t(key, params);
  }
  return '';
};

export const changeLanguage = (language?: LANGUAGES): Promise<string> => {
  return new Promise((resolve, reject) => {
    i18n.changeLanguage(renLanguage(language)).then((success) => {
      ZustandPersist.getState().save('Localization', renLanguage(language))
      setTimeout(() => {
        resolve('Change language success');
      }, 500);
    }).catch((error) => {
      reject(error.toString());
    });
  });

};
