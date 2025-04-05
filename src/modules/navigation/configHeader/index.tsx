import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'
import { Platform, StatusBar } from 'react-native'
import { useAppTheme } from 'shared/theme'
import { globalShadowStyle } from 'shared/theme/globalStyle'
import { AppText } from 'src/modules/components/text/AppText'
import { BackButton } from 'src/modules/navigation/components/BackButton'

export const CreateHeaderDefault = (): StackNavigationOptions => {
  const theme = useAppTheme();

  const headerOption: StackNavigationOptions = {
    headerTitleStyle: {
      color: theme.color.neutral[900],
      fontSize: theme.fontSize.p20,
      fontWeight: 500,
      textTransform: 'capitalize',
    },
    headerTitle: ({ style, children, allowFontScaling }: any) =>
      children && typeof children === 'string' ? <AppText>{`children`}</AppText> : null,
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
    headerTintColor: theme.color.primary[300],
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
