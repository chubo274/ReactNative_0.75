import { AppText } from 'components/text/AppText';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ITheme, useAppTheme } from 'shared/theme';
import { globalShadowStyle } from 'shared/theme/globalStyle';

interface IProps {
    style?: StyleProp<ViewStyle>
    colorIcon?: string
    disabled?: boolean
}
export const NotiHeaderButton = React.memo((props: IProps) => {
  const { style, disabled } = props
  const theme = useAppTheme();
  // const navigation = useNavigation<StackNavigationProp<AppStackParamList, 'HomeScreen'>>()
  const imgSize = theme.dimensions.makeResponsiveSize(32);
  // const countNotiNumber = useGet('TotalNotiUnread')
  const countNotiNumber = 10

  const countNotiTxt = useMemo(() => {
    if (countNotiNumber) {
      if (countNotiNumber > 99)
      {return '99+'}
      return countNotiNumber.toString()
    }
    return ''
  }, [countNotiNumber])

  const styleCountNoti = useMemo(() => {
    if (countNotiTxt?.length == 3)
    {return { right: -10, width: 24 }}
    if (countNotiTxt?.length == 2)
    {return { right: -8, width: 22 }}
    if (countNotiTxt?.length == 1)
    {return { right: -1, width: 15 }}
    return undefined
  }, [countNotiTxt])

  const styles = useStyles(theme, imgSize, styleCountNoti);

  const renderBadge = useMemo(() => {
    if (!countNotiTxt) {return null}
    return <View style={styles.badgeContainer}>
      <AppText style={styles.txtCountNoti}>{countNotiTxt}</AppText>
    </View>
  }, [countNotiTxt, styles])

  const handleNoti = () => {
    // navigation.navigate('NotificationScreen')
  }

  return <TouchableOpacity activeOpacity={0.8} onPress={handleNoti} style={[styles.buttonWrapper, style]} disabled={disabled}>
    {/* <BellRinging size={20} color={colorIcon ? colorIcon : theme.color.button.icon} weight='fill' /> */}
    {renderBadge}
  </TouchableOpacity>
})

const useStyles = (theme: ITheme, imgSize: number, styleCountNoti?: { right: number, width: number }) => StyleSheet.create({
  buttonWrapper: {
    backgroundColor: theme.color.bg.white,
    borderRadius: imgSize,
    padding: theme.dimensions.p8,
    ...globalShadowStyle.shadow,
  },
  badgeContainer: {
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 50,
    borderColor: 'blue',
    borderWidth: 2,
    position: 'absolute',
    top: 0,
    right: styleCountNoti?.right,
  },
  txtCountNoti: {
    color: theme.color.textColor.white,
    fontFamily: theme.font.Bold,
    fontSize: 12,
    textAlign: 'center',
    width: styleCountNoti?.width,
  }
})
