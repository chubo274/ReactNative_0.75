import { LANGUAGES, ModeTheme } from 'src/shared/helpers/enum';

export interface ISessionStorage {
  token?: string;
  refreshToken?: string;
}

export interface ZustandPersistModel {
  Token?: ISessionStorage,
  Localization?: LANGUAGES,
  ThemeApp?: ModeTheme,
}