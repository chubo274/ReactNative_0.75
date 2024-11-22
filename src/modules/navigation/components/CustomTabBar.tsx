import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { RenderImage } from 'components/image/RenderImage'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'
import { TabBarIcon } from './TabBarIcon'
import { TabScreen } from 'src/shared/helpers/enum'

const sizeIcon = {
  height: 20,
  width: 20,
}
export const CustomTabBar = (props: BottomTabBarProps) => {
  const { navigation, state, descriptors } = props
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const { name: routeName } = route
        let nameDisplay;

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          })

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate(route)
          }
        }

        // const onLongPress = () => {
        //     navigation.emit({
        //         type: 'tabLongPress',
        //         target: route.key
        //     })
        // };

        const renderImage = (isFocused: boolean) => {
          switch (routeName) {
            case TabScreen.HomeTab:
              nameDisplay = t('home');
              return <RenderImage source={undefined} style={sizeIcon} />;
            case TabScreen.CartTab:
              nameDisplay = t('cart');
              return <RenderImage source={undefined} style={sizeIcon} />;
            case TabScreen.AiStreamTab:
              nameDisplay = t('aiStream');
              return <RenderImage source={undefined} style={sizeIcon} />;
            case TabScreen.CategoryTab:
              nameDisplay = t('categories');
              return <RenderImage source={undefined} style={sizeIcon} />;
            case TabScreen.ProfileTab:
              nameDisplay = t('profile');
              return <RenderImage source={undefined} style={sizeIcon} />;
            default:
              return null;
          }
        }

        return (
          <TouchableOpacity
            key={routeName}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            // onLongPress={onLongPress}
            style={styles.item}
          >
            <TabBarIcon icon={renderImage(isFocused)} routeName={routeName} displayName={nameDisplay}
              isFocused={isFocused} containerStyle={undefined}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    height: theme.dimensions.makeResponsiveSize(86),
    // position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.dimensions.makeResponsiveSize(16),
    paddingHorizontal: theme.dimensions.makeResponsiveSize(16),
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
