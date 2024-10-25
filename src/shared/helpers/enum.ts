
export enum LANGUAGES {
  ENGLISH = 'en',
  VIETNAM = 'vi',
  JAPAN = 'ja',
  KOREA = 'ko',
}

export enum ActionStatus {
  None = 'none',
  Fetching = 'fetching',
  Refreshing = 'refreshing',
  LoadMore = 'loadmore',
  Done = 'done',
}

export enum ModeTheme {
  Default = 1,
  Sakura = 2,
}

export enum DateTimeFormat {
  APIFormat = 'YYYY-MM-DD HH:mm:ss',  // defeault api, moment

  FullDateTime = 'DD-MM-YYYY hh:mm:ss',
  DateTimeAmPm = 'DD-MM-YYYY hh A',
  DateTime24h = 'DD-MM-YYYY HH:mm',

  Time = 'hh:mm:ss',
  FullDate = 'DD MMM YYYY',
  TimeHourMinPM = 'HH:mm A',
  HourMinutes = 'HH:mm',
}
