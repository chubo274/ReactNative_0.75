import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from 'src/modules/screen/home'
import ProfileScreen from 'src/modules/screen/profile'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AppTabParamList } from '../AppParamsList'
import { CustomTabBar } from '../components/CustomTabBar'
import { OrderScreen } from 'src/modules/screen/order/OrderScreen'
import { ShopScreen } from 'src/modules/screen/shop/ShopScreen'
import { IncentivesScreen } from 'src/modules/screen/incentives/IncentivesScreen'
import { OtherContentScreen } from 'src/modules/screen/otherContent/OtherContentScreen'
import { CreateHeaderTabDefault } from '../configHeader'

const Tab = createBottomTabNavigator<AppTabParamList>();
interface IProps {

}

const AppTab = (props: IProps) => {
  const { t } = useTranslation();
  const defaultOptions = CreateHeaderTabDefault();

  return <Tab.Navigator
    initialRouteName={'HomeScreen'}
    screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
      tabBarAllowFontScaling: false,
    }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen name='HomeScreen' component={HomeScreen} options={{}} />
    <Tab.Screen name='OrderScreen' component={OrderScreen} options={{}} />
    <Tab.Screen name='ShopScreen' component={ShopScreen} options={{}} />
    <Tab.Screen name='IncentivesScreen' component={IncentivesScreen} options={{}} />
    <Tab.Screen name='OtherContentScreen' component={OtherContentScreen} options={{...defaultOptions, headerTitle: t('other')}} />
  </Tab.Navigator>
}

export default AppTab
