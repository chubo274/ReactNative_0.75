
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
  APIFormat = 'yyyy-MM-dd HH:mm:ss',

  FullDateTime = 'dd-MM-YYYY hh:mm:ss',
  DateTimeAmPm = 'dd-MM-yyyy hh aaa',
  DateTime24h = 'dd-MM-yyyy HH:mm',

  Time = 'hh:mm:ss',
  FullDate = 'dd MMM yyyy',
  TimeHourMinPM = 'HH:mm aaa',
  HourMinutes = 'HH:mm',
}
