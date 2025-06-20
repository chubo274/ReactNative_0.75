import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import ImageSource from 'src/assets/images'
import { RenderImage } from 'components/image/RenderImage'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { ITheme, useAppTheme } from 'shared/theme'
import { TabBarIcon } from './TabBarIcon'
import { Coffee, HouseLine, List, Storefront, Ticket } from 'phosphor-react-native';

const sizeIcon = {
  height: 20,
  width: 20,
}
export const  CustomTabBar = (props: BottomTabBarProps) => {
  const { navigation, state, descriptors } = props
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  return (
    <ImageBackground style={styles.container} source={ImageSource.img_bg_bottom_nav}>
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
            navigation.navigate(route as any)
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
            case 'HomeScreen':
              nameDisplay = t('home');
              return <HouseLine size={32} weight="light" />
            case 'OrderScreen':
              nameDisplay = t('order');
              return <Coffee size={32} weight="light" />;
            case 'ShopScreen':
              nameDisplay = t('shop');
              return <Storefront size={32} weight="light" />;
            case 'IncentivesScreen':
              nameDisplay = t('incentives');
              return <Ticket size={32} weight="light" />;
            case 'OtherContentScreen':
              nameDisplay = t('other');
              return <List size={32} weight="light" />;
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
    </ImageBackground>
  );
}

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    // height: theme.dimensions.getTabBottomHeight,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: theme.dimensions.makeResponsiveSize(18),
    backgroundColor: 'transparent'
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
})
