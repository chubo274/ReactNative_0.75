import { PixelRatio, Dimensions, Platform, StatusBar } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const screenHeight = Dimensions.get('screen').height
const navbarHeight = screenHeight - height + (StatusBar.currentHeight ?? 0)

const scale = width / 375

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

const dimensions = {
  androidBottomNavHeight: Platform.OS === 'android' ? navbarHeight : 0,
  deviceHeight: height,
  deviceWidth: width,
  makeResponsiveSize: responsiveSize,
  getStatusBarHeight: statusBarHeight,
  getBottomSpacing: responsiveSize(40),
  getTabBottomHeight: responsiveSize(86),
  p2: responsiveSize(2),
  p4: responsiveSize(4),
  p6: responsiveSize(6),
  p8: responsiveSize(8),
  p10: responsiveSize(10),
  p12: responsiveSize(12),
  p14: responsiveSize(14),
  p16: responsiveSize(16),
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
  p2: responsiveSize(2),
  p4: responsiveSize(4),
  p6: responsiveSize(6),
  p8: responsiveSize(8),
  p11: responsiveSize(11),
  p12: responsiveSize(12),
  p13: responsiveSize(13),
  p15: responsiveSize(15),
  p16: responsiveSize(16),
  p18: responsiveSize(18),
  p20: responsiveSize(20),
  p24: responsiveSize(24),
  p28: responsiveSize(28),
  p32: responsiveSize(32),
  p36: responsiveSize(36),
  p40: responsiveSize(40),
  p48: responsiveSize(48),
}

export default { dimensions, fontSize }
