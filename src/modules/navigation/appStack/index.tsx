import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { AppStackParamList } from '../AppParamsList'
import { CreateHeaderDefault } from '../configHeader'
import AppTab from './AppTab'
import AiStreamScreen from 'src/modules/screen/aiStream'

const Stack = createStackNavigator<AppStackParamList>();

interface IProps { }

const AppStack = (props: IProps) => {
  const defaultOptions = CreateHeaderDefault();

  return <Stack.Navigator screenOptions={defaultOptions} initialRouteName={'AppTab'}>
    <Stack.Screen name="AppTab" component={AppTab} options={{ headerShown: false }} />
    <Stack.Screen name="AiStreamScreen" component={AiStreamScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
}

export default AppStack;
