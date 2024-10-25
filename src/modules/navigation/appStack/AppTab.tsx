import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from 'src/modules/screen/home'
import ProfileScreen from 'src/modules/screen/profile'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AppTabParamList, HomeStackParamList, ProfileStackParamList } from '../AppParamsList'
import { CreateHeaderTab } from '../configHeader'
import { CustomTabBar } from '../components/CustomTabBar'

const Tab = createBottomTabNavigator<AppTabParamList>()
const Home = createStackNavigator<HomeStackParamList>()
const Profile = createStackNavigator<ProfileStackParamList>()

interface IProps {

}

const HomeStack = (props: IProps) => {
  return <Home.Navigator screenOptions={{ headerShown: false }} initialRouteName={'HomeScreen'}>
    <Home.Screen name="HomeScreen" component={HomeScreen} />
  </Home.Navigator>
}

const ProfileStack = (props: IProps) => {
  const { t } = useTranslation();
  const defaultOptions = CreateHeaderTab('ProfileTab')

  return <Profile.Navigator screenOptions={defaultOptions} initialRouteName={'ProfileScreen'}>
    <Profile.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerTitle: t('profile') }} />
  </Profile.Navigator>
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
    <Tab.Screen name="HomeTab" component={HomeStack} options={{}} />
    <Tab.Screen name="ProfileTab" component={ProfileStack} options={{}} />
  </Tab.Navigator>
}

export default AppTab
