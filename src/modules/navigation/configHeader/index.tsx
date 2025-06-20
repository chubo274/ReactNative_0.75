import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { StackNavigationOptions } from '@react-navigation/stack'
import { Bell, Ticket } from 'phosphor-react-native'
import React from 'react'
import { Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'
import { globalShadowStyle } from 'shared/theme/globalStyle'
import { AppText } from 'src/modules/components/text/AppText'
import { BackButton } from 'src/modules/navigation/components/BackButton'

export const CreateHeaderDefault = (): StackNavigationOptions => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const headerOption: StackNavigationOptions = {
    headerTitleStyle: {
      // color: theme.color.neutral[900],
      fontSize: theme.fontSize.p20,
      fontWeight: 500,
      textTransform: 'capitalize',
    },
    headerTitle: ({ style, children, allowFontScaling }: any) =>
      children && typeof children === 'string' ?
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <AppText>{`children`}</AppText>
        <View style={styles.right_header}>
          <TouchableOpacity activeOpacity={0.8} style={styles.voucher_btn}>
            <Ticket color='#cd853f' size={20} weight="light" />
          </TouchableOpacity>
          <View style={{width: 5}} />
          <TouchableOpacity activeOpacity={0.8} style={styles.notification_btn}>
            <Bell size={20} weight="light" />
          </TouchableOpacity>
        </View>
      </View>
      : null,
    headerTitleAlign: 'left',
    headerBackTitleStyle: {
      color: theme.color.navigation.navigationTintColor
    },
    headerStyle: {
      backgroundColor: theme.color.navigation.navigationBackgroundColor,
      height: theme.dimensions.getHeightHeader,
      ...globalShadowStyle.offShadow
    },
    headerStatusBarHeight: Platform.select({
      android: StatusBar.currentHeight
    }),
    headerRightContainerStyle: {
      paddingRight: theme.dimensions.p16
    },
    headerLeftContainerStyle: {
      paddingLeft: theme.dimensions.p16
    },
    // headerTintColor: theme.color.primary[300],
    headerTitleAllowFontScaling: false,
    headerBackTestID: 'navigation-go-back-button',
    title: '',
    headerLeft: ({ tintColor }: any) => <BackButton />,
    // headerRight,
    headerPressColor: 'transparent',
    headerMode: 'screen',
    presentation: 'card',

  };

  return headerOption
}

export const CreateHeaderTabDefault = (): BottomTabNavigationOptions => {
  const defaultHeader = CreateHeaderDefault()
  const headerOption: BottomTabNavigationOptions = {
    headerShown: defaultHeader.headerShown,
    headerTitleStyle: defaultHeader.headerTitleStyle,
    headerTitleAlign: defaultHeader.headerTitleAlign,
    headerStyle: defaultHeader.headerStyle,
    headerStatusBarHeight: defaultHeader.headerStatusBarHeight,
    headerRightContainerStyle: defaultHeader.headerRightContainerStyle,
    // headerLeftContainerStyle: defaultHeader.headerLeftContainerStyle,
    headerTintColor: defaultHeader.headerTintColor,
    headerTitleAllowFontScaling: defaultHeader.headerTitleAllowFontScaling,
    title: '',
    // headerLeft: ({ tintColor }: any) => <BackButton tintColor={tintColor} />,
    headerPressColor: defaultHeader.headerPressColor,
  }
  return headerOption
}

const useStyles = (theme: ITheme) => StyleSheet.create({
  right_header: {
    // flex: 1,
    flexDirection: 'row',
  },
  voucher_btn: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification_btn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
