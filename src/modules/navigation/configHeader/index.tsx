import { StackNavigationOptions } from '@react-navigation/stack'
import { BackButton } from 'src/modules/navigation/components/BackButton'
import { AppText } from 'src/modules/components/text/AppText'
import { RenderImage } from 'components/image/RenderImage'
import { NotiHeaderButton } from 'src/modules/navigation/components/NotiHeaderButton'
import React from 'react'
import { Platform } from 'react-native'
import { useAppTheme } from 'shared/theme'
import { isIphoneDynamicIsland, isIphoneX } from 'shared/theme/dimensions'
import { globalShadowStyle } from 'shared/theme/globalStyle'
import { AppTabParamList } from '../AppParamsList'

export const CreateHeaderDefault = (): StackNavigationOptions => {
  const theme = useAppTheme();

  const headerOption: StackNavigationOptions = {
    headerTitleStyle: {
      color: theme.color.textColor.primary,
      fontSize: theme.fontSize.p20,
      fontFamily: theme.font.Medium,
      textTransform: 'capitalize',
    },
    headerTitle: ({ style, children, allowFontScaling }: any) =>
      children && typeof children === 'string' ? <AppText>{`children`}</AppText> : null,
    headerTitleAlign: 'left',
    headerBackTitleStyle: {
      color: theme.color.navigation.navigationTintColor
      // fontFamily: theme.font.ExtraBold
    },
    headerStyle: {
      backgroundColor: theme.color.navigation.navigationBackgroundColor,
      height: Platform.select({
        ios: isIphoneDynamicIsland() ? 120 : isIphoneX() ? 100 : 80
      }),
      ...globalShadowStyle.offShadow
    },
    headerStatusBarHeight: Platform.select({
      android: theme.dimensions.p8
    }),
    headerRightContainerStyle: {
      paddingRight: theme.dimensions.p16
    },
    headerLeftContainerStyle: {
      paddingLeft: theme.dimensions.p16
    },
    headerTintColor: theme.color.textColor.primary,
    headerTitleAllowFontScaling: false,
    headerBackTitleVisible: false,
    headerBackTestID: 'navigation-go-back-button',
    title: '',
    headerLeft: ({ tintColor }: any) => <BackButton tintColor={tintColor} />,
    // headerRight,
    headerPressColor: 'transparent',
    headerMode: 'screen',
    presentation: 'card'
  };

  return headerOption
}

export const CreateHeaderTab = (tabName: keyof AppTabParamList): StackNavigationOptions => {
  const theme = useAppTheme();
  const sizeIcon = {
    height: theme.dimensions.p20,
    width: theme.dimensions.p20
  }
  const renderIconLeft = () => {
    switch (tabName) {
      case 'HomeTab':
        return <RenderImage source={undefined} style={sizeIcon} />;
      case 'ProfileTab':
        return <RenderImage source={undefined} style={sizeIcon} />;
        // return <UserCircle size={sizeIcon} color={theme.color.textColor.primary} weight={'duotone'} />
      default:
        return null;
    }
  }
  const headerOption: StackNavigationOptions = {
    ...CreateHeaderDefault(),
    headerLeft: renderIconLeft,
    // headerTitleStyle: { ...CreateHeaderDefault().headerTitleStyle, marginLeft: -6 },
    headerRight: () => <NotiHeaderButton />,
  }
  return headerOption
}

export const CreateHeaderNoti = (): StackNavigationOptions => {
  const theme = useAppTheme();
  const widthTitle = theme.dimensions.deviceWidth - (theme.dimensions.p16 * 2 + 36) - (theme.dimensions.makeResponsiveSize(44));
  const deafultConfig: any = CreateHeaderDefault()
  const headerOption: StackNavigationOptions = {
    ...deafultConfig,
    headerTitleStyle: { ...deafultConfig.headerTitleStyle, width: widthTitle },
    headerRight: () => <NotiHeaderButton />,
  }
  return headerOption
}
