import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import HomeScreen from 'src/modules/screen/home'
import ProfileScreen from 'src/modules/screen/profile'
import CartScreen from 'src/modules/screen/cart'
import AiStreamScreen from 'src/modules/screen/aiStream'
import CategoryScreen from 'src/modules/screen/category'
import { CustomTabBar } from '../components/CustomTabBar'
import { AppTabParamList } from '../AppParamsList'
import { TabScreen } from 'src/shared/helpers/enum'

const Tab = createBottomTabNavigator<AppTabParamList>()
interface IProps {

}

const AppTab = (props: IProps) => {
  return <Tab.Navigator
    initialRouteName={'HomeTab'}
    screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
      tabBarAllowFontScaling: false,
    }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen name={TabScreen.HomeTab} component={HomeScreen} options={{}} />
    <Tab.Screen name={TabScreen.CartTab} component={CartScreen} options={{}} />
    <Tab.Screen name={TabScreen.AiStreamTab} component={AiStreamScreen} options={{}} />
    <Tab.Screen name={TabScreen.CategoryTab} component={CategoryScreen} options={{}} />
    <Tab.Screen name={TabScreen.ProfileTab} component={ProfileScreen} options={{}} />
  </Tab.Navigator>
}

export default AppTab
