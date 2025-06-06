import { PixelRatio, Dimensions, Platform, StatusBar } from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height // height without Status and Bar
const screenHeight = Dimensions.get('screen').height // height include Status and Bar
const navbarHeight = screenHeight - height + (StatusBar.currentHeight ?? 0)

const scale = width / 430

const responsiveSize = (size: number) => {
  const newSize = size * scale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

export const isIphoneX = () => {
  const dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    ((dimen.height === 780 || dimen.width === 780) ||
      (dimen.height === 812 || dimen.width === 812) ||
      (dimen.height === 844 || dimen.width === 844) ||
      (dimen.height === 896 || dimen.width === 896) ||
      (dimen.height === 926 || dimen.width === 926))
  );
}

export const isIphoneDynamicIsland = () => {
  const dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    ((dimen.height === 852 || dimen.width === 852) ||
      (dimen.height === 932 || dimen.width === 932))
  );
}

const statusBarHeight = Platform.select({
  ios: isIphoneX() ? 47 : isIphoneDynamicIsland() ? 59 : 20,
  android: StatusBar.currentHeight,
  default: 0
})

const heightHeader = Platform.OS == 'ios' ? (isIphoneDynamicIsland() ? 120 : (isIphoneX() ? 100 : 80)) : 60

const dimensions = {
  androidBottomNavHeight: Platform.OS === 'android' ? navbarHeight : 0,
  deviceHeight: screenHeight,
  deviceWidth: width,
  makeResponsiveSize: responsiveSize,
  getStatusBarHeight: statusBarHeight,
  getHeightHeader: heightHeader,
  getBottomSpacing: (initialWindowMetrics?.insets?.bottom || responsiveSize(16)) + responsiveSize(16),
  getTabBottomHeight: responsiveSize(80),
  p2: responsiveSize(2),
  p4: responsiveSize(4),
  p6: responsiveSize(6),
  p8: responsiveSize(8),
  p10: responsiveSize(10),
  p12: responsiveSize(12),
  p14: responsiveSize(14),
  p16: responsiveSize(16),
  p18: responsiveSize(18),
  p20: responsiveSize(20),
  p24: responsiveSize(24),
  p28: responsiveSize(28),
  p30: responsiveSize(30),
  p32: responsiveSize(32),
  p40: responsiveSize(40),
  p48: responsiveSize(48),
  p50: responsiveSize(50),
  p56: responsiveSize(56),
  p62: responsiveSize(62)
}

const fontSize = {
  makeResponsiveSize: responsiveSize,
  p12: responsiveSize(12),
  p14: responsiveSize(14),
  p16: responsiveSize(16),
  p20: responsiveSize(20),
  p24: responsiveSize(24),
  p32: responsiveSize(32),
  p42: responsiveSize(42),
  p52: responsiveSize(52),
  p72: responsiveSize(72),
  p120: responsiveSize(120),
}

export default { dimensions, fontSize }
