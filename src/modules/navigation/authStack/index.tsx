import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from 'src/modules/screen/login'
import React from 'react'
import { AuthStackParamList } from '../AppParamsList'
import { CreateHeaderDefault } from '../configHeader'

const Stack = createStackNavigator<AuthStackParamList>()

interface IProps {
}

const AuthStack = (props: IProps) => {
  const defaultOptions = CreateHeaderDefault()

  return <Stack.Navigator screenOptions={defaultOptions} initialRouteName={'LoginScreen'}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ ...defaultOptions, headerLeft: undefined }} />
  </Stack.Navigator>
}

export default AuthStack
