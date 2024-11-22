
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

export enum TabScreen {
  HomeTab = 'HomeTab',
  CartTab = 'CartTab',
  AiStreamTab = 'AiStreamTab',
  CategoryTab = 'CategoryTab',
  ProfileTab = 'ProfileTab',
}

export enum TxtTypo {
  Smallest_R = 'Smallest_R',
  Smallest_M = 'Smallest_M',
  Bodysmall_R = 'Bodysmall_R',
  Bodysmall_M = 'Bodysmall_M',
  Body_R = 'Body_R',
  Body_M = 'Body_M',
  Heading5_R = 'Heading5_R',
  Heading5_M = 'Heading5_M',
  Heading4_M = 'Heading4_M',
  Heading4_B = 'Heading4_B',
  Heading3_M = 'Heading3_M',
  Heading3_B = 'Heading3_B',
  Heading2 = 'Heading2',
  Heading1 = 'Heading1',
  Display2 = 'Display2',
  Display1 = 'Display1',
}
