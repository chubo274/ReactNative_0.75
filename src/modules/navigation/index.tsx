import { StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import NavigationService from 'shared/helpers/NavigationService'
import AppStack from './appStack'
import AuthStack from './authStack'
import SplashScreen from '../screen/splashScreen/splashScreen'

const Stack = createStackNavigator()

interface IProps {

}

export const backToTopAuthStack = () => {
  NavigationService.topLevelNavigator?.dispatch(StackActions.replace('Auth'))
}

export const backToTopAppStack = () => {
  NavigationService.topLevelNavigator?.dispatch(StackActions.replace('App'))
}

const RootStack = (props: IProps) => {
  // set data local for zustand - from Provider
  // That got a issue, useEffect in this file run first before access_token clear by force logout

  return <Stack.Navigator
    initialRouteName={'AppSplash'}
    screenOptions={{
      headerMode: 'screen',
      presentation: 'card',
      headerShown: false,
      animationTypeForReplace: 'push',
    }}
  >
    <Stack.Screen name={'AppSplash'} component={SplashScreen} />
    <Stack.Screen name={'App'} component={AppStack} />
    <Stack.Screen name={'Auth'} component={AuthStack} />
  </Stack.Navigator>
}

export default RootStack
