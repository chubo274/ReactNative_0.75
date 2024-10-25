import { AppText } from 'components/text/AppText';
import React, { useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'

interface IProps {
    icon: React.ReactNode;
    routeName: string;
    displayName?: string;
    isFocused?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

export const TabBarIcon = React.memo((props: IProps) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { icon, containerStyle, isFocused, displayName } = props

  const [badge,] = useState(0)

  // useEffect(() => {
  //     const subscription = EventEmitter.addListener(EventNames.updateTabBarBadge, data => {
  //         const { name: tabName, count } = data;
  //         if (tabName === name) {
  //             setBadge(count);
  //         }
  //     });
  //     return () => {
  //         subscription.remove();
  //     };
  // }, [name, setBadge]);

  return <View style={[styles.container, containerStyle]}>
    {icon}
    {displayName ? <AppText style={[styles.txtDisplay, { color: isFocused ? theme.color.navigation.tabbarActiveColor : theme.color.navigation.tabbarInactiveColor }]}>{displayName}</AppText> : null}
    {badge ? <View style={styles.badge} /> : null}
  </View>
})

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtDisplay: {
    fontSize: theme.fontSize.p11,
    textTransform: 'capitalize'
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -8,
    backgroundColor: theme.color.bg.white,
    borderRadius: 10,
    width: theme.dimensions.makeResponsiveSize(20),
    height: theme.dimensions.makeResponsiveSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff'
  },
})
